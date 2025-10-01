// src/components/ScrollingFeatureList.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Card from "./Card";
// Import the new hook
import { useMobileDetection } from "./hooks/useMobileDetection"; 
type CardData = {
  title: string;
  text: string;
};

export default function ScrollingFeatureList({ data }: { data: CardData[] }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // 1. Use the mobile detection hook
  const isMobile = useMobileDetection();

  useEffect(() => {
    // 2. Only run the scroll logic if it's NOT a mobile device
    if (isMobile) {
        // If mobile, don't track scroll state, and immediately return.
        return; 
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      let currentActiveIndex = 0;
      for (let i = featureRefs.current.length - 1; i >= 0; i--) {
        const feature = featureRefs.current[i];
        if (feature && feature.offsetTop - 50 < scrollPosition) {
            currentActiveIndex = i;
            break;
        }
      }
      setActiveIndex(currentActiveIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]); // Re-run effect when isMobile changes

  return (
    <section className="relative w-full ">
      <div className="sticky top-0 z-10 h-18 flex items-center justify-center bg-gray-50 text-[#001429]">
        <h1 className="text-4xl font-bold text-center">
          {/* You might want to add a title here */}
        </h1>
      </div>
      
      <div className="relative">
        {data.map((card, index) => (
          <div 
            key={index} 
            ref={el => { featureRefs.current[index] = el; }}
            // We use 'min-h-[60vh]' to create the scroll effect. 
            // We can reduce this height substantially on mobile to make the list flow better.
            className={isMobile ? "w-4/5 mx-auto py-4" : "min-h-[60vh] w-4/5 mx-auto"}
          >
            <Card
              title={card.title}
              text={card.text}
              // 3. The critical change: force true if on mobile, otherwise use the scroll state
              isExpanded={isMobile || activeIndex === index}
            />
          </div>
        ))}
      </div>
    </section>
  );
}