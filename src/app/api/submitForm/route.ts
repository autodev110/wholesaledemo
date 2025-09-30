// src/app/api/submitForm/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { runAIAgent } from "./aiagent";

// 🔹 Init Supabase (no changes)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// 🔹 Sanitizer function (no changes)
const sanitizePropertyData = (data: any) => {
  const details = data?.propertyDetails;
  if (!details) return { error: "Property details not found in API response." };

  const lastSale = details.priceHistory?.find(
    (event: any) => event.event === "Sold"
  );
  const nearbySchools = details.schools?.map((school: any) => ({
    name: school.name,
    rating: school.rating,
    grades: school.grades,
  }));

  return {
    streetAddress: details.address?.streetAddress,
    city: details.address?.city,
    state: details.address?.state,
    zipcode: details.address?.zipcode,
    county: details.county,
    propertyType: details.homeType,
    structureType: details.resoFacts?.structureType,
    yearBuilt: details.yearBuilt,
    bedrooms: details.bedrooms,
    bathrooms: details.bathroomsFloat || details.bathrooms,
    livingArea_sqft: details.livingArea,
    lotSize_sqft: details.lotSize,
    zestimate: details.zestimate,
    annualTaxAmount: details.resoFacts?.taxAnnualAmount,
    taxAssessedValue: details.resoFacts?.taxAssessedValue,
    lastSale: lastSale
      ? { date: lastSale.date, price: lastSale.price }
      : "No sale history found",
    pricePerSquareFoot: details.resoFacts?.pricePerSquareFoot,
    daysOnZillow: details.daysOnZillow,
    nearbySchools: nearbySchools,
    description: details.description,
    heating: details.resoFacts?.heating,
    cooling: details.resoFacts?.cooling,
    parkingCapacity: details.resoFacts?.parkingCapacity,
    zillowUrl: data.zillowURL,
    price: details.price,
  };
};

// 🔹 Real Estate API call (no changes)
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
    method: "GET",
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "zillow-working-api.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API error! status: ${response.status} - ${errorText}`
      );
    }
    const rawData = await response.json();
    return sanitizePropertyData(rawData);
  } catch (e: any) {
    console.error("Failed to fetch property data from RapidAPI:", e.message);
    return { error: `Failed to fetch property data: ${e.message}` };
  }
}

// ==================================================================================
// POST HANDLER - TEMPORARILY DISABLED CAPTCHA
// ==================================================================================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { captcha, ...formData } = body;

    // 🔹 TEMPORARY BYPASS — skip captcha validation
    // -------------------------------------------------------
    // if (!captcha) return NextResponse.json({ error: "Captcha missing" }, { status: 400 });
    // const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
    // });
    // const captchaData = await captchaRes.json();
    // if (!captchaData.success) {
    //   return NextResponse.json({ error: "Captcha failed" }, { status: 400 });
    // }
    console.warn("⚠️ Captcha validation skipped (TEMPORARY)");

    // Supabase insert (no changes)
    const { error } = await supabase.from("property_leads").insert([formData]);
    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Call the services (no changes)
    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`;
    const propertyDetails = await getPropertyDetailsAPI(fullAddress);

    if (propertyDetails.error) {
      console.warn(
        `Could not fetch property details for: ${fullAddress}. Proceeding with only form data for AI agent. Error: ${propertyDetails.error}`
      );
    }

    const { userOutput, internalOutput } = await runAIAgent(
      formData,
      propertyDetails
    );

    // Nodemailer logic (no changes)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Property Lead + AI Appraisal",
      text: internalOutput,
    });

    if (formData.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: formData.email,
        subject: "Your Property Evaluation from Simple Home Offer",
        text: userOutput,
      });
    }

    return NextResponse.json({ message: "Form submitted successfully" });
  } catch (err: any) {
    console.error("Error in POST /api/submitForm:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
