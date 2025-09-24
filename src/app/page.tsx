// src/app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import ScrollingFeatureList from "./components/ScrollingFeatureList";

const cardData = [
 {
   title: "Step 1: Submit Your Info",
   text: "Fill out our simple, confidential online form with some basic details about your property. It takes less than two minutes, and there's no obligation. This gives us the information we need to start crafting your fair cash offer."
 },
 {
   title: "Step 2: Get a Fair Offer",
   text: "We'll review your property details and the current market conditions. Within 24 hours, we will contact you with a no-obligation, all-cash offer. We pride ourselves on transparency, so we'll walk you through exactly how we arrived at our number."
 },
 {
   title: "Step 3: Close On Your Timeline",
   text: "If you accept our offer, the rest is easy. You pick the closing date that works for you, whether it's in a week or a few months. We handle all the paperwork and closing costs. All you have to do is show up, sign, and get your cash. \nYes, Its really that simple!"
 }
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-gray-50">
      <div className="h-48 flex items-center justify-center text-center bg-gradient-to-b from-[#001429] to-[#002952]">
        {/* Add 'inline-block' to fix the rendering issue */}
        <h1 className="text-5xl font-extrabold">
          <span className="bg-gradient-to-r from-[#dc6601] via-[#f5c77e] to-[#dc6601] bg-clip-text text-transparent">
            Sell Your House, Stress-Free.
          </span>
        </h1>
      </div>

      <ScrollingFeatureList data={cardData} />

      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <button
          className="rounded-lg font-semibold transition-transform hover:scale-105 bg-gradient-to-b from-[#001429] to-[#001f3d] px-16 py-8"
          onClick={() => router.push("/form")}
        >
          <span className="text-3xl bg-gradient-to-r from-[#f5b858] via-[#f5c77e] to-[#f5b858] bg-clip-text text-transparent">
            Click To Get Your Free Offer Now !
          </span>
        </button>
      </div>
    </main>
  );
}