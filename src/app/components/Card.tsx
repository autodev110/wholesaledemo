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
    // CHANGE 3: Increased padding (p-6 to p-8) and centered all text (text-center)
    <div className="bg-white rounded-xl shadow-md p-8 w-full mb-6 text-center">
      {/* CHANGE 1: Made the title larger (text-xl to text-2xl) */}
      <h2 className="text-2xl font-bold mb-2 text-gray-900">{title}</h2>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* CHANGE 1: Made the body text larger (added text-lg) */}
            <p className="text-lg text-gray-700 pt-2">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}