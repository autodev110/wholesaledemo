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
    // The padding has been increased here from p-8 to p-12
    <div className="bg-gradient-to-b from-[#001429] to-[#002952] text-[#f5c77e] rounded-xl shadow-md p-16 w-full mb-6 text-center">
      <h2 className="text-4xl font-bold mb-2">{title}</h2>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-2xl pt-3 whitespace-pre-wrap">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}