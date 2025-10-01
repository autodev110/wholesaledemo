// src/app/page.tsx
// Full version with the definitive wrapper div fix for the header height.

import ScrollingFeatureList from "./components/ScrollingFeatureList";
import Image from "next/image";
import CtaButton from "./components/CtaButton"; 

const cardData = [
 {
   title: "Step 1: Submit Your Info",
   text: "Fill out our simple, confidential online form with some basic details about your property. It takes less than two minutes, and there's no obligation. This gives us the information we need to start crafting your fair cash offer."
 },
 {
   title: "Step 2: Get Your Offer",
   text: "We'll review your property details and the current market conditions in South Jersey. Within 24 hours, we will contact you with a no-obligation, all-cash offer. We pride ourselves on transparency, so we'll walk you through exactly how we arrived at our number."
 },
 {
   title: "Step 3: Close On Your Timeline",
   text: "If you accept our offer, the rest is easy. You pick the closing date that works for you, whether it's in a week or a few months. We handle all the paperwork and closing costs. All you have to do is show up, sign, and get your cash. Yes, it's really that simple!"
 }
];

export default function Home() {
  return (
    <main className="bg-gray-50 text-[#001429]">
      {/* ADD THIS WRAPPER DIV to isolate content from layout stretching */}
      <div>

        {/* HERO SECTION */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#001429] to-[#002952] py-0 h-[50vh] md:h-[50vh] text-center px-4">        
          <Image
            src="/images/sho_trans.png"
            alt="Simple Home Offer - We Buy Houses for Cash in Pennsylvania"
            width={800}
            height={150}
            priority
          />
        </div>

        {/* YOUR 3-STEP PROCESS (Second section) */}
        <ScrollingFeatureList data={cardData} />

        {/* MAIN CALL TO ACTION (with the corrected H1 tag) */}
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white">
          <h1 className="text-3xl md:text-5xl font-bold mt-8 text-black max-w-4xl">
            Sell Your House Fast in Pennsylvania – Get a Fair Cash Offer Today
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl mb-10">
            Avoid the hassle of realtors, repairs, and months of uncertainty. We buy houses in any condition.
          </p>
          <CtaButton />
        </div>

        {/* SUPPORTING SEO CONTENT - "Who We Help" Section */}
        <section className="py-20 px-4 text-center bg-gradient-to-b from-[#001429] to-[#002952] text-white">
          <h2 className="text-4xl font-bold mb-6 text-[#f5c77e]">We Help Homeowners in Any Situation</h2>
          <p className="text-xl mb-16 max-w-3xl mx-auto text-gray-300">
            Our process is designed to provide a simple solution for homeowners facing challenging circumstances. We can help if you are:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="bg-[#001f3d] rounded-xl shadow-lg p-8 transform transition-transform hover:scale-105 duration-300 border border-[#f5b858]">
              <h3 className="text-2xl font-semibold mb-4 text-[#f5c77e]">Facing Foreclosure?</h3>
              <p className="text-lg text-gray-200">A fast cash sale can help you avoid foreclosure and protect your credit and financial future.</p>
            </div>
            <div className="bg-[#001f3d] rounded-xl shadow-lg p-8 transform transition-transform hover:scale-105 duration-300 border border-[#f5b858]">
              <h3 className="text-2xl font-semibold mb-4 text-[#f5c77e]">Inherited a Property?</h3>
              <p className="text-lg text-gray-200">We make it easy to sell an unwanted inherited house without the stress or cost of cleaning it out.</p>
            </div>
            <div className="bg-[#001f3d] rounded-xl shadow-lg p-8 transform transition-transform hover:scale-105 duration-300 border border-[#f5b858]">
              <h3 className="text-2xl font-semibold mb-4 text-[#f5c77e]">Tired of Being a Landlord?</h3>
              <p className="text-lg text-gray-200">Sell your rental property, even with tenants, and get rid of the headaches for good.</p>
            </div>
          </div>
        </section>

        {/* SUPPORTING SEO CONTENT - FAQ Section */}
        <section className="py-20 px-4 text-center bg-white">
          <h2 className="text-4xl font-bold mb-14 text-[#001429]">Your Questions, Answered</h2>
          <div className="max-w-4xl mx-auto text-left space-y-8">
            <div className="border-b pb-6 border-gray-200">
              <h3 className="text-2xl font-semibold mb-3 text-[#001429]">Q: Do I need to make any repairs to my house?</h3>
              <p className="text-lg text-gray-700">A: Absolutely not. We buy properties completely "as-is" in any condition. You don't have to fix a thing – no painting, no cleaning, no renovations needed.</p>
            </div>
            <div className="border-b pb-6 border-gray-200">
              <h3 className="text-2xl font-semibold mb-3 text-[#001429]">Q: Are there any hidden fees or commissions?</h3>
              <p className="text-lg text-gray-700">A: None at all. When you sell to Simple Home Offer, the cash offer we provide is exactly the amount you receive at closing. We cover all closing costs and there are no agent commissions.</p>
            </div>
            <div className="pb-6">
              <h3 className="text-2xl font-semibold mb-3 text-[#001429]">Q: How quickly can you really buy my house?</h3>
              <p className="text-lg text-gray-700">A: We are flexible and work on your schedule. If you need to sell fast, we can close in as little as 7-10 days. If you need more time, that's perfectly fine too!</p>
            </div>
          </div>
        </section>
        
      {/* END OF WRAPPER DIV */}
      </div>
    </main>
  );
}