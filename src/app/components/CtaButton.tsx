// src/app/components/CtaButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function CtaButton() {
  const router = useRouter();

  return (
    <button
      className="rounded-lg font-semibold transition-transform hover:scale-115 bg-gradient-to-b from-[#001429] to-[#001f3d] px-16 py-8"
      onClick={() => router.push("/form")}
    >
      <span className="text-3xl bg-gradient-to-r from-[#f5b858] via-[#f5c77e] to-[#f5b858] bg-clip-text text-transparent">
        Get My Cash Offer Now!
      </span>
    </button>
  );
}