// src/components/Card.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Card({ 
  title, 
  text, 
  isExpanded 
}: { 
  title: string; 
  text: string; 
  isExpanded: boolean;
}) {
  return (
    // Adjust padding to be smaller on mobile (p-8) and larger on medium screens and up (md:p-16)
    <div className="bg-gradient-to-b from-[#001429] to-[#002952] text-[#f5c77e] rounded-xl shadow-md p-8 md:p-16 w-full mb-6 text-center">
      
      {/* H2 Class Breakdown:
        - text-2xl: Default text size for mobile (smaller than original 4xl)
        - md:text-4xl: Increase text size to 4xl for medium screens and up (your original desktop size)
      */}
      <h2 className="text-2xl md:text-4xl font-bold mb-2">{title}</h2>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* P Class Breakdown:
              - text-base: Default text size for mobile (smaller than original 2xl)
              - md:text-2xl: Increase text size to 2xl for medium screens and up
            */}
            <p className="text-base md:text-2xl pt-3 whitespace-pre-wrap">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}