// src/app/api/submitForm/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { scrapeRealtor } from "@/app/lib/scraper";


// ... (keep your Supabase, Gemini, and runAI function initializations)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// 🔹 AI function - NOW ENHANCED
// in src/app/api/submitForm/route.ts

async function runAI(formData: any, propertyDetails: object | string) {
  const detailsString = typeof propertyDetails === 'object' && propertyDetails !== null
    ? JSON.stringify(propertyDetails, null, 2)
    : propertyDetails;

  const basePrompt = `
You are a real estate investment analyst. Your task is to create a preliminary property valuation.

**User Submitted Data:**
${JSON.stringify(formData, null, 2)}

**Scraped Public Property Info:**
${detailsString}

---
**INSTRUCTIONS**

First, generate the user-facing email content. It should be polite, professional, and encouraging. Calculate 78% of your estimated market value and present this result as the "estimated cash offer." **Do not mention the 78% percentage in this output.**

Second, on a new line, generate the internal analysis. It MUST start with the exact label "Internal appraisal:". This section should contain your realistic market valuation, a list of repairs, cost estimates, and the final cash offer amount.
`;

  const result = await model.generateContent(basePrompt);
  const text = result.response.text();

  const [userOutput, internalOutput] = text.split(/Internal appraisal:/i);
  return {
    userOutput: userOutput?.trim() || "Thanks for your submission. We will be in touch soon.",
    // We add the label back in for the internal email to be clear
    internalOutput: internalOutput?.trim() ? `Internal appraisal:\n${internalOutput.trim()}` : "No internal appraisal generated.",
  };
}

// 🔹 REMOVE the old getPropertyDetails stub

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { captcha, ...formData } = body;

    // ... (keep your captcha validation and Supabase insert logic)
    // 1. Validate captcha
    if (!captcha) {
      return NextResponse.json({ error: "Captcha missing" }, { status: 400 });
    }
    const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
    });
    const captchaData = await captchaRes.json();
    if (!captchaData.success) {
      return NextResponse.json({ error: "Captcha failed" }, { status: 400 });
    }

    // 2. Insert into Supabase
    const { error } = await supabase.from("property_leads").insert([formData]);
    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }


    // 3. Run SCRAPER and AI analysis
    // 🔽 THIS IS THE NEW LOGIC 🔽
    let propertyDetails;
    try {
      const fullAddress = formData.address;
      // Change the function call
      propertyDetails = await scrapeRealtor(fullAddress); // Formerly scrapeZillow
      if (!propertyDetails) {
        propertyDetails = "Scraping failed. Using only user-submitted data.";
      }
    } catch (scrapeError) {
      console.error("Scraping function threw an error:", scrapeError);
      propertyDetails = "An error occurred during scraping. Using only user-submitted data.";
    }

    const { userOutput, internalOutput } = await runAI(formData, propertyDetails);
    // 🔼 END OF NEW LOGIC 🔼


    // ... (keep your nodemailer email logic)
    // 4. Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 5. Internal email (to you)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Property Lead + AI Appraisal",
      text: `Form data:\n${JSON.stringify(formData, null, 2)}\n\nAI Analysis:\n${internalOutput}`,
    });

    // 6. User-facing email
    if (formData.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: formData.email,
        subject: "Your Property Evaluation",
        text: userOutput,
      });
    }


    return NextResponse.json({ message: "Form submitted successfully" });
  } catch (err: any) {
    console.error("Error in POST /api/submitForm:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}