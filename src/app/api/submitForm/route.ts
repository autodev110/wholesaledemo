// src/app/api/submitForm/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔹 Init Supabase & Gemini (no changes)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// 1. Sanitizer function moved from your test page
const sanitizePropertyData = (data: any) => {
  const details = data?.propertyDetails;
  if (!details) return { error: "Property details not found." };
  
  const lastSale = details.priceHistory?.find((event: any) => event.event === "Sold");
  const nearbySchools = details.schools?.map((school: any) => ({
    name: school.name, rating: school.rating, grades: school.grades
  }));

  return {
    streetAddress: details.address?.streetAddress, city: details.address?.city, state: details.address?.state, zipcode: details.address?.zipcode, county: details.county,
    propertyType: details.homeType, structureType: details.resoFacts?.structureType, yearBuilt: details.yearBuilt, bedrooms: details.bedrooms, bathrooms: details.bathroomsFloat || details.bathrooms, livingArea_sqft: details.livingArea, lotSize_sqft: details.lotSize,
    zestimate: details.zestimate, annualTaxAmount: details.resoFacts?.taxAnnualAmount, taxAssessedValue: details.resoFacts?.taxAssessedValue,
    lastSale: lastSale ? { date: lastSale.date, price: lastSale.price } : "No sale history found",
    pricePerSquareFoot: details.resoFacts?.pricePerSquareFoot, daysOnZillow: details.daysOnZillow,
    nearbySchools: nearbySchools, description: details.description, heating: details.resoFacts?.heating, cooling: details.resoFacts?.cooling, parkingCapacity: details.resoFacts?.parkingCapacity,
    zillowUrl: data.zillowURL,
  };
};


// 2. Real Estate API call (replaces placeholder)
async function getPropertyDetailsAPI(address: string) {
  console.log(`Fetching API data for: ${address}`);
  
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    console.error("RAPIDAPI_KEY is not defined.");
    return { error: "API key is not configured on the server." };
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://zillow-working-api.p.rapidapi.com/pro/byaddress?propertyaddress=${encodedAddress}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'zillow-working-api.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error! status: ${response.status} - ${errorText}`);
    }
    const rawData = await response.json();
    return sanitizePropertyData(rawData); // Return the clean, structured data
  } catch (e: any) {
    console.error("Failed to fetch property data from RapidAPI:", e.message);
    return { error: `Failed to fetch property data: ${e.message}` };
  }
}


// 3. Upgraded AI function with new, smarter prompt
async function runAI(formData: any, propertyDetails: object) {
  const basePrompt = `
You are a data-driven real estate investment analyst. Your task is to create a preliminary property valuation. You have two sources of information:
1.  **User Submitted Data**: Subjective information from the homeowner (e.g., property condition, needed repairs).
2.  **API Property Data**: Objective, factual data pulled from a real estate database (e.g., Zestimate, tax records, sales history).

**Your Goal**: Synthesize BOTH sources to create an accurate appraisal. Prioritize the API Data as your baseline, and use the User Submitted Data to adjust the valuation up or down.

**API Property Data (Objective Baseline):**
${JSON.stringify(propertyDetails, null, 2)}

**User Submitted Data (For Adjustments):**
${JSON.stringify(formData, null, 2)}

---
**INSTRUCTIONS**

First, generate the user-facing email content.
- Base your estimated market value primarily on the API's "zestimate" and "lastSale" price, but include everything else mentioned such as nearby school ratings and neighborhood as well as details from the description.
- Adjust this value based on the user's notes (e.g., if "Property Condition" is "Needs Work", lower the valuation).
- Calculate 78% of your adjusted market value and present this result as the "estimated cash offer." **Do not mention the 78% percentage or the market value, only give them our adjusted cash offer in this output.**

Second, on a new line, generate the internal analysis. It MUST start with the exact label "Internal appraisal:".
- Provide your realistic, unbiased market valuation.
- List key data points from the API that influenced your decision (e.g., tax assessment, sqft, comps).
- List required repairs based on user notes and estimate a rehab cost.
- State the final "estimated cash offer" that was sent to the seller.
`;

  const result = await model.generateContent(basePrompt);
  const text = result.response.text();

  const [userOutput, internalOutput] = text.split(/Internal appraisal:/i);
  return {
    userOutput: userOutput?.trim() || "Thanks for your submission. We will be in touch soon.",
    internalOutput: internalOutput?.trim() ? `Internal appraisal:\n${internalOutput.trim()}` : "No internal appraisal generated.",
  };
}

// POST Handler - No major changes needed here
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { captcha, ...formData } = body;

    // ... (Captcha validation remains the same)
    if (!captcha) return NextResponse.json({ error: "Captcha missing" }, { status: 400 });
    const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
    });
    const captchaData = await captchaRes.json();
    if (!captchaData.success) return NextResponse.json({ error: "Captcha failed" }, { status: 400 });

    // ... (Supabase insert remains the same)
    const { error } = await supabase.from("property_leads").insert([formData]);
    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Call the NEW API function and the NEW AI function
    const propertyDetails = await getPropertyDetailsAPI(formData.address);
    const { userOutput, internalOutput } = await runAI(formData, propertyDetails);

    // ... (Nodemailer logic remains the same)
    const transporter = nodemailer.createTransport({
      service: "gmail", auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER, to: process.env.EMAIL_USER,
      subject: "New Property Lead + AI Appraisal",
      text: `Form data:\n${JSON.stringify(formData, null, 2)}\n\nAI Analysis:\n${internalOutput}`,
    });
    if (formData.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER, to: formData.email,
        subject: "Your Property Evaluation", text: userOutput,
      });
    }

    return NextResponse.json({ message: "Form submitted successfully" });
  } catch (err: any) {
    console.error("Error in POST /api/submitForm:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}