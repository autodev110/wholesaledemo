// src/app/about/page.tsx
import Card from "@/app/components/Card";

// It's good practice to keep the card content in an array
const aboutPageData = [
  {
    title: "About Us",
    text: "Based right here in the heart of New Jersey, Simple Home Offer was founded by a team of local real estate professionals who saw a need for a simpler, more compassionate way to sell a home. We're your neighbors, not a faceless corporation. We've seen firsthand how the traditional market can be slow, unpredictable, and stressful for homeowners facing unique situations. Our goal is to provide a reliable alternative that puts you in control. We buy houses directly, in any condition, allowing you to bypass the repairs, showings, and lengthy waiting periods, and move forward with confidence and cash in hand."
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
      {/* Page Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-12 px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Your Trusted Local Home Buyer
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Learn more about our commitment to helping homeowners in our community.
          </p>
        </div>
      </header>

      {/* Main Content with Cards */}
      <main className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid gap-8">
          {aboutPageData.map((card, index) => (
            <div key={index}>
              {/* We reuse your existing Card component */}
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