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
    list_price?: number;
    last_sale?: { date: string; price: number };
    seller_provided_condition: Record<string, string | number | boolean | undefined>;
    known_liens_and_mortgage: {
      taxes_owed: number;
      liens_owed: number;
      mortgage_balance: number;
    };
    sale_stage?: "upset" | "judicial" | "sheriff" | "private";
  };
  // CHANGE 1: end_buyer_target_margin_pct is no longer a fixed input
  cost_assumptions: {
    closing_costs: number;
    holding_costs_pct_of_arv: number;
    wholesaler_min_profit: number;
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
  // CHANGE 2: Added field for the AI's condition assessment
  estimated_condition?: "Good" | "Moderate" | "Poor";
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
      list_price: safeNum(propertyDetails.price, undefined, 0),
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
    // CHANGE 3: Removed the fixed margin from cost assumptions
    cost_assumptions: {
      closing_costs: 10000,
      holding_costs_pct_of_arv: 0.03,
      wholesaler_min_profit: 40000,
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

  // CHANGE 4: Updated system prompt to ask for condition assessment
  const systemPrompt = `
You are a disciplined real-estate wholesale underwriter. Your role is to ANALYZE and ESTIMATE, not to perform final calculations.

Your job:
- Produce a defensible ARV (After Repair Value) with a low, base, and high estimate. Justify your reasoning based on provided data like listing price, zestimate, and property details.

- Estimate rehab costs as detailed line-items (roof, cosmetics, etc.). Your estimate MUST be heavily influenced by the \`seller_provided_condition\` data.
  - If the seller reports recent upgrades (e.g., 'new roof'), your rehab cost for that item should be minimal or zero.
  - If the seller reports known issues or the property is old, budget for repairs accordingly.
  - Always include a 10-15% contingency on the total rehab cost.

- Based on all available data (seller's input, property age, and your own rehab estimate), classify the overall property condition. You must choose one of three options: "Good", "Moderate", or "Poor".

- Add lien survivability notes based on the sale_stage.
- Give a final investment decision: "GO", "CONDITIONAL", or "NO_GO".
- Rank potential risks with severity ("High", "Medium", "Low") and suggest mitigations.

Format:
Respond with a single JSON object only.
Keys:
- subject_summary { address }
- arv { low, base, high, reasoning }
- rehab { total, line_items[] }
- estimated_condition ("Good", "Moderate", or "Poor")
- decision
- risks_ranked[]
- lien_survivability_note
- general_overview (a brief summary paragraph of your analysis)

Do NOT include a 'deal_math' key in your response. All financial calculations will be handled separately. No extra commentary outside the JSON.
`;

  const userPrompt = `
Analyze this property for a wholesale deal based on our playbook. Provide your estimates and analysis.
Payload: ${JSON.stringify(inputJson)}
`;

  try {
    const result = await model.generateContent([systemPrompt, userPrompt]);
    let responseText = result.response.text().trim();
    console.log("RAW GEMINI OUTPUT:", responseText);

    responseText = responseText.replace(/```json/i, "").replace(/```/g, "").trim();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in model output");

    const raw = JSON.parse(jsonMatch[0]);

    // CHANGE 5: The entire calculation block is updated for dynamic margins

    // 1. Get AI Estimates
    const arvBase = raw.arv?.base ?? 0;
    const rehabTotal = raw.rehab?.total ?? 0;
    const condition = raw.estimated_condition;

    // 2. Determine Dynamic End Buyer Margin based on AI's assessment
    let endBuyerTargetMarginPct = 0.125; // Default to "Moderate" condition
    switch (condition) {
      case "Good":
        endBuyerTargetMarginPct = 0.075; // 7.5% for properties in good shape
        break;
      case "Poor":
        endBuyerTargetMarginPct = 0.175; // 17.5% for properties in poor shape
        break;
    }

    // 3. Get Cost Assumptions from our input
    const costs = inputJson.cost_assumptions;
    const liens = inputJson.subject.known_liens_and_mortgage;

    // 4. Perform Deterministic Calculations
    const totalEncumbrances = liens.taxes_owed + liens.liens_owed + liens.mortgage_balance;
    const holdingCosts = arvBase * costs.holding_costs_pct_of_arv;

    const endBuyerMao =
      arvBase * (1 - endBuyerTargetMarginPct) - // Use the new dynamic margin
      rehabTotal -
      costs.closing_costs -
      holdingCosts;

    const offerToSellerMax = endBuyerMao - costs.wholesaler_min_profit;

    // 5. Assemble the final, complete analysis object
    const analysisResult: AIOutputSchema = {
      subject_summary: { address: raw.subject_summary?.address ?? "N/A" },
      arv: {
        low: raw.arv?.low ?? 0,
        base: arvBase,
        high: raw.arv?.high ?? 0,
        reasoning: raw.arv?.reasoning ?? "No reasoning provided",
      },
      rehab: {
        total: rehabTotal,
        line_items: raw.rehab?.line_items ?? [],
      },
      deal_math: {
        total_encumbrances: totalEncumbrances,
        offer_to_seller_max: offerToSellerMax,
        end_buyer_mao: endBuyerMao,
      },
      decision: raw.decision ?? "NO_GO",
      risks_ranked: raw.risks_ranked ?? [],
      lien_survivability_note: raw.lien_survivability_note ?? "N/A",
      estimated_condition: condition,
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