// src/app/about/page.tsx
import Card from "@/app/components/Card";
import Image from "next/image";
import Link from "next/link";

// It's good practice to keep the card content in an array
const aboutPageData = [
  {
    title: "About Us",
    text: "Simple Home Offer was founded by a team of real estate professionals who saw a need for a simpler, more compassionate way to sell a home. We're your neighbors, not a faceless corporation. We've seen firsthand how the traditional market can be slow, unpredictable, and stressful for homeowners facing unique situations. Our goal is to provide a reliable alternative that puts you in control. We buy houses directly, in any condition, allowing you to bypass the repairs, showings, and lengthy waiting periods, and move forward with confidence and cash in hand."
  },
  {
    title: "Mission & Values",
    text: "Our mission is to provide homeowners with the fastest, most transparent, and stress-free property selling experience possible. We operate on a foundation of core values that guide every interaction and transaction: Integrity, Compassion, Simplicity, and Reliability. We believe in complete transparency, understanding your unique situation, handling all complexities, and standing by our cash offer to close on your timeline."
  },
  {
    title: "Testimonials",
    text: "“After my father passed away, I inherited his home in Camden. Living out of state, the thought of managing repairs and a traditional sale was a nightmare. The team was incredible, honest, and we closed in two weeks.” – Michael R. \n\n “I was a tired landlord with a rental property in Cherry Hill that needed more work than I was willing to put in. They gave me a solid cash offer and took the property as-is. It was a huge weight off my shoulders.” – Linda P."
  }
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header - Updated with clickable logo */}
      <div className="h-95 flex items-center justify-center text-center bg-gradient-to-b from-[#001429] to-[#002952]">
        <Link href="/" passHref>
          <Image
            src="/images/sho_trans.png"
            alt="Simple Home Offer Logo"
            width={850}
            height={150}
            priority
            className="cursor-pointer"
          />
        </Link>
      </div>

      {/* Main Content with Cards */}
      <main className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid gap-8">
          {aboutPageData.map((card, index) => (
            <div key={index}>
              <Card 
                title={card.title} 
                text={card.text}
                isExpanded={true} // Keep the card always expanded
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
