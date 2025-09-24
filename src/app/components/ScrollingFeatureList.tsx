// src/components/ScrollingFeatureList.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Card from "./Card";

type CardData = {
  title: string;
  text: string;
};

export default function ScrollingFeatureList({ data }: { data: CardData[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      let currentActiveIndex = 0;
      for (let i = featureRefs.current.length - 1; i >= 0; i--) {
        const feature = featureRefs.current[i];
        if (feature && feature.offsetTop - 150 < scrollPosition) {
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
  }, []);

  return (
    <section className="relative w-full py-12">
      <div className="sticky top-0 z-10 h-48 flex items-center justify-center bg-gray-50 text-gray-900">
        <h1 className="text-4xl font-bold text-center">
          Our Simple Process
        </h1>
      </div>
      
      <div className="relative">
        {data.map((card, index) => (
          // The width is now set to 80% of the screen (w-4/5)
          <div 
            key={index} 
            ref={el => { featureRefs.current[index] = el; }}
            className="min-h-[60vh] w-4/5 mx-auto"
          >
            <Card
              title={card.title}
              text={card.text}
              isExpanded={activeIndex === index}
            />
          </div>
        ))}
      </div>
    </section>
  );
}