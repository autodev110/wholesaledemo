// src/app/api/submitForm/aiagent.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

// ==================================================================================
// 1. INIT GEMINI CLIENT (FLASH MODEL, JSON ONLY MODE)
// ==================================================================================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json", // ask for JSON
  },
});

// ==================================================================================
// 2. TYPES
// ==================================================================================
interface AIInputSchema {
  subject: {
    address: string;
    county: string;
    beds: number;
    baths: number;
    sqft: number;
    /* New fields */

    /*------------------------------------------------*/
    lot_sqft: number;
    year_built: number;
    zestimate?: number;
    last_sale?: { date: string; price: number };
    seller_provided_condition: Record<string, string | number | boolean | undefined>;
    known_liens_and_mortgage: {
      taxes_owed: number;
      liens_owed: number;
      mortgage_balance: number;
    };
    sale_stage?: "upset" | "judicial" | "sheriff" | "private";
  };
  cost_assumptions: {
    closing_costs: number;
    wholesaler_min_profit: number;
    end_buyer_target_margin_pct: number;
  };
}

interface AIOutputSchema {
  subject_summary: { address: string };
  arv: { low: number; base: number; high: number; reasoning: string };
  rehab: { total: number; line_items: { item: string; total: number; notes: string }[] };
  deal_math: { total_encumbrances: number; offer_to_seller_max: number; end_buyer_mao: number };
  decision: "GO" | "CONDITIONAL" | "NO_GO";
  risks_ranked: { risk: string; severity: "High" | "Medium" | "Low"; mitigation: string }[];
  lien_survivability_note?: string;
}

// ==================================================================================
// 3. SAFE HELPERS
// ==================================================================================
const safeNum = (formVal: any, apiVal: any, fallback = 0) => {
  const n = parseFloat(formVal ?? apiVal);
  if (isNaN(n) || n < 0) return fallback;
  return n;
};

const safeStr = (formVal: any, apiVal: any, fallback = "N/A") => {
  return formVal || apiVal || fallback;
};

// ==================================================================================
// 4. BUILD INPUT JSON
// ==================================================================================
function buildInputJson(formData: any, propertyDetails: any): AIInputSchema {
  const fullAddress = [
    formData.address,
    formData.apartment,
    formData.city,
    formData.state,
    formData.zip,
  ].filter(Boolean).join(", ");

  return {
    subject: {
      address: safeStr(fullAddress, propertyDetails.streetAddress),
      county: safeStr(formData.county, propertyDetails.county),
      beds: safeNum(formData.beds, propertyDetails.bedrooms),
      baths: safeNum(formData.baths, propertyDetails.bathrooms),
      sqft: safeNum(formData.sqft, propertyDetails.livingArea_sqft),
      lot_sqft: safeNum(formData.lot_sqft, propertyDetails.lotSize_sqft),
      year_built: safeNum(formData.year_built, propertyDetails.yearBuilt),
      zestimate: safeNum(formData.zestimate, propertyDetails.zestimate, 0),
      last_sale: propertyDetails.lastSale?.price ? propertyDetails.lastSale : undefined,
      seller_provided_condition: {
        roof_age: formData.roof_age,
        sewer_type: formData.sewer_type,
        foundation_issues: formData.foundation,
        electrical_issues: formData.electrical,
        plumbing_condition: formData.plumbing_condition,
        heating_fuel: formData.heating_fuel,
        cooling_fuel: formData.cooling_fuel,
        renovations: formData.renovations,
        occupancy: formData.occupancy,
        /* New fields */
        acreage: formData.acreage,
        yearbuilt: formData.yearbuilt,
        system_amperage: formData.system_amperage,
        /*------------------------------------------------*/
      },
      known_liens_and_mortgage: {
        taxes_owed: safeNum(formData.owed_taxes, propertyDetails.annualTaxAmount, 0),
        liens_owed: safeNum(formData.owed_liens, 0, 0),
        mortgage_balance: safeNum(formData.owed_mortgage, 0, 0),
      },
      sale_stage: formData.sale_stage ?? "private",
    },
    cost_assumptions: {
      closing_costs: 10000,
      wholesaler_min_profit: 50000,
      end_buyer_target_margin_pct: 0.15,
    },
  };
}

// ==================================================================================
// 5. FORMATTING FUNCTIONS
// ==================================================================================
function formatUserMessage(analysis: AIOutputSchema, formData: any): string {
  const offer = analysis.deal_math?.offer_to_seller_max;
  if (!offer || offer <= 0) {
    return `Hello ${formData.name || ""},

Thank you for submitting your property details. After a preliminary review, we are unable to extend a cash offer at this time.`;
  }
  const formattedOffer = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(offer);
  return `Hello ${formData.name || ""},

Thank you for submitting your property at ${analysis.subject_summary.address}.
We are pleased to present you with a preliminary cash offer.

Estimated Cash Offer: ${formattedOffer}`;
}

function formatInternalReport(analysis: AIOutputSchema, formData: any, propertyDetails: any): string {
  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num || 0);
  return `
INTERNAL AI APPRAISAL
=======================
DECISION: ${analysis.decision}
ADDRESS: ${analysis.subject_summary.address}

LIEN SURVIVABILITY
-----------------------
${analysis.lien_survivability_note ?? "N/A"}

DEAL METRICS
-----------------------
ARV: ${formatCurrency(analysis.arv.base)} (Range: ${formatCurrency(analysis.arv.low)} - ${formatCurrency(analysis.arv.high)})
Reasoning: ${analysis.arv.reasoning}
Rehab: ${formatCurrency(analysis.rehab.total)}
Encumbrances: ${formatCurrency(analysis.deal_math.total_encumbrances)}
End Buyer MAO: ${formatCurrency(analysis.deal_math.end_buyer_mao)}
MAX OFFER: ${formatCurrency(analysis.deal_math.offer_to_seller_max)}

RISKS
-----------------------
${analysis.risks_ranked
  .map((r) => `- ${r.severity}: ${r.risk} (Mitigation: ${r.mitigation})`)
  .join("\n")}

RAW DATA
=======================
FORM:
${JSON.stringify(formData, null, 2)}

API:
${JSON.stringify(propertyDetails, null, 2)}
`;
}

// ==================================================================================
// 6. MAIN FUNCTION
// ==================================================================================
export async function runAIAgent(formData: any, propertyDetails: any) {
  const inputJson = buildInputJson(formData, propertyDetails);

  const systemPrompt = `
You are a disciplined real-estate wholesale underwriter for PA counties (expandable nationwide).
Evaluate properties from tax sales and direct seller leads.

Your job:
- Produce a defensible ARV from zestimate, last sale, and condition adjustments.
- Estimate rehab costs as line-items (roof, electrical, plumbing, foundation, cosmetics, etc.) with contingency.
- Compute Wholesale MAO: (ARV × (1 - margin)) - Rehab - Closing Costs - Payoffs. 
  Then Offer_to_Seller_Max = End Buyer MAO - Wholesaler Profit (≥ $50k).
- Add lien survivability notes (Upset = liens survive, Judicial = free/clear, Sheriff = check, Private = standard).
- Give a decision: "GO", "CONDITIONAL", or "NO_GO".
- Rank risks with severity and mitigations.
- Factor in property details, nearby school and neighborhood ratings, market trends, and economic conditions as relevant to your analysis as well.

Format:
Respond with a single JSON object only.
Keys:
- subject_summary { address }
- arv { low, base, high, reasoning }
- rehab { total, line_items[] }
- deal_math { total_encumbrances, offer_to_seller_max, end_buyer_mao }
- decision
- risks_ranked[]
- lien_survivability_note
- general overview (analysis summary paragraph)

No extra commentary outside JSON.
`;

  const userPrompt = `
Evaluate this property for wholesaling using our playbook.
Payload: ${JSON.stringify(inputJson)}
`;

  try {
    const result = await model.generateContent([systemPrompt, userPrompt]);
    let responseText = result.response.text().trim();
    console.log("RAW GEMINI OUTPUT:", responseText);

    // Strip Markdown if present
    responseText = responseText.replace(/```json/i, "").replace(/```/g, "").trim();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in model output");

    const raw = JSON.parse(jsonMatch[0]);

    // Normalize to avoid crashes
    const analysisResult: AIOutputSchema = {
      subject_summary: { address: raw.subject_summary?.address ?? "N/A" },
      arv: {
        low: raw.arv?.low ?? 0,
        base: raw.arv?.base ?? 0,
        high: raw.arv?.high ?? 0,
        reasoning: raw.arv?.reasoning ?? "No reasoning provided",
      },
      rehab: {
        total: raw.rehab?.total ?? 0,
        line_items: raw.rehab?.line_items ?? [],
      },
      deal_math: {
        total_encumbrances: raw.deal_math?.total_encumbrances ?? 0,
        offer_to_seller_max: raw.deal_math?.offer_to_seller_max ?? 0,
        end_buyer_mao: raw.deal_math?.end_buyer_mao ?? 0,
      },
      decision: raw.decision ?? "NO_GO",
      risks_ranked: raw.risks_ranked ?? [],
      lien_survivability_note: raw.lien_survivability_note ?? "N/A",
    };

    return {
      userOutput: formatUserMessage(analysisResult, formData),
      internalOutput: formatInternalReport(analysisResult, formData, propertyDetails),
    };
  } catch (error) {
    console.error("Error running AI Agent:", error);
    return {
      userOutput:
        "Thank you for your submission. We will follow up after manual review.",
      internalOutput: `AI FAILED. Error: ${error}\n\nForm: ${JSON.stringify(
        formData,
        null,
        2
      )}\n\nAPI: ${JSON.stringify(propertyDetails, null, 2)}`,
    };
  }
}
