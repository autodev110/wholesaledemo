// src/app/api/submitForm/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔹 Init Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// 🔹 Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 🔹 Placeholder for your future Real Estate Data API
async function getPropertyDetailsAPI(address: string) {
  console.log(`Fetching data for: ${address}`);
  // ** FUTURE API CALL GOES HERE **
  // Example:
  // const response = await fetch(`https://api.realestatedata.com/property?address=${address}`);
  // const data = await response.json();
  // return data;

  // For now, we return a simple placeholder string.
  return "No public property info available. Appraisal is based on user input only.";
}

// 🔹 AI function (reverted to simpler version)
async function runAI(formData: any, propertyDetails: string) {
  const basePrompt = `
You are a real estate investment analyst. Your task is to create a preliminary property valuation based ONLY on user-submitted data.

**User Submitted Data:**
${JSON.stringify(formData, null, 2)}

**Additional Data:**
${propertyDetails}

---
**INSTRUCTIONS**

First, generate the user-facing email content. It should be polite and professional. Base your estimated value on the user's requested value and property condition notes. Calculate 78% of your estimated market value and present this result as the "estimated cash offer." **Do not mention the 78% percentage in this output.**

Second, on a new line, generate the internal analysis. It MUST start with the exact label "Internal appraisal:". This section should contain your realistic market valuation, a list of repairs based on user notes, cost estimates, and the final cash offer amount.
`;

  const result = await model.generateContent(basePrompt);
  const text = result.response.text();

  const [userOutput, internalOutput] = text.split(/Internal appraisal:/i);
  return {
    userOutput: userOutput?.trim() || "Thanks for your submission. We will be in touch soon.",
    internalOutput: internalOutput?.trim() ? `Internal appraisal:\n${internalOutput.trim()}` : "No internal appraisal generated.",
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { captcha, ...formData } = body;

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

    // 3. Call the placeholder API function
    const propertyDetails = await getPropertyDetailsAPI(formData.address);
    const { userOutput, internalOutput } = await runAI(formData, propertyDetails);

    // 4. Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 5. Internal email
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