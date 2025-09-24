// src/app/page.tsx
"use client"; // Add this to use the router hook

import { useRouter } from "next/navigation"; // Import the router
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
  const router = useRouter(); // Initialize the router

  return (
    <main className="bg-gray-50">
      <div className="h-48 flex items-center justify-center text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h1 className="text-5xl font-bold">Sell Your House, Stress-Free.</h1>
      </div>

      <ScrollingFeatureList data={cardData} />

      {/* CHANGE: Added a button to the bottom section */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <button
          className="px-8 py-4 bg-indigo-700 text-white rounded-lg font-semibold text-lg hover:bg-indigo-800 transition-colors"
          onClick={() => router.push("/form")}
        >
          Click To Get Your Free Offer Now !
        </button>
      </div>
    </main>
  );
}