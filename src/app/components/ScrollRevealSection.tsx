// src/components/ScrollRevealSection.tsx
"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// This component wraps any content you want to animate on scroll
export default function ScrollRevealSection({ children }: { children: React.ReactNode }) {
  // useRef is used to target the DOM element we want to track
  const ref = useRef<HTMLDivElement>(null);

  // useScroll tracks the scroll progress of the target element (ref)
  const { scrollYProgress } = useScroll({
    target: ref,
    // Start tracking when the top of the element hits the middle of the screen
    // End tracking when the bottom of the element hits the middle of the screen
    offset: ["start center", "end center"]
  });

  // useTransform maps the scroll progress (from 0 to 1) to other values
  // As we scroll through the section (from 0 to 1), opacity will go from 0 -> 1 -> 0
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1], // Input range (at 20% and 80% of the scroll, it's fully visible)
    [0, 1, 1, 0]      // Output range (fades in, stays visible, then fades out)
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8] // Grows in, stays full size, then shrinks out
  );

  return (
    // The main container that takes up the full screen height
    // We attach the ref here to track its scroll position
    <div ref={ref} className="min-h-screen flex items-center justify-center">
      {/* The motion.div applies the animated styles */}
      <motion.div
        style={{ opacity, scale }}
        className="w-[80%]" // Takes up 80% of the screen width as you wanted
      >
        {children}
      </motion.div>
    </div>
  );
}