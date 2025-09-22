import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔹 Init Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // use service key for server routes
);

// 🔹 Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// or gemini-1.5-pro if you want higher quality (slower, more costly)

// 🔹 AI function
async function runAI(formData: any, propertyDetails: string) {
  const basePrompt = `
You are a real estate appraisal assistant.

Form data:
${JSON.stringify(formData, null, 2)}

Public property info:
${propertyDetails}

Return two outputs:

1. User-facing appraisal (undervalue the property by 22% so we profit, polite tone, short, include estimated repairs, finish with a looking forwards to dicussing with you further message).
2. Internal appraisal (realistic valuation, detailed notes, list of repairs, rehab cost estimate, include the estimate cost number that will be sent to seller).

Label the second section "Internal appraisal:" so we can split them apart. Do not label the first section, begin with a greeting and go right into the appraisal.
`;

  const result = await model.generateContent(basePrompt);
  const text = result.response.text();

  // Split into two outputs
  const [userOutput, internalOutput] = text.split(/Internal appraisal/i);
  return {
    userOutput: userOutput?.trim() || "Thanks for your submission. We will be in touch soon.",
    internalOutput: internalOutput?.trim() || "No internal appraisal generated.",
  };
}

// 🔹 Temporary property lookup stub
async function getPropertyDetails(address: string) {
  // Replace with real Zillow/SerpAPI lookup later
  return `Property at ${address}`;
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

    // 3. Run AI analysis
    const propertyDetails = await getPropertyDetails(formData.address);
    const { userOutput, internalOutput } = await runAI(formData, propertyDetails);

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
