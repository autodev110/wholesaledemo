import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // service key for server routes
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("property_leads")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Route error:", err.message);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
  
}
console.log("Gemini key exists?", !!process.env.GEMINI_API_KEY);
