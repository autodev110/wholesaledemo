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
    // 1. Replaced 'bg-white' with the navy gradient
    // 2. Added the new text color 'text-[#f5c77e]'
    <div className="bg-gradient-to-b from-[#001429] to-[#002952] text-[#f5c77e] rounded-xl shadow-md p-8 w-full mb-6 text-center">
      {/* 3. Removed the old text color from the title */}
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* 3. Removed the old text color from the body */}
            <p className="text-lg pt-2 whitespace-pre-wrap">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}