// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="sticky bottom-0 w-full bg-gradient-to-b from-[#001429] to-[#002952] text-[#f5c77e] p-4 z-20">
      {/* 1. Add 'relative' to this container to act as a positioning anchor */}
      <div className="relative max-w-7xl mx-auto flex justify-between items-center text-sm">
        
        {/* Left Side: About Us Button */}
        <div>
          <Link href="/about" className="hover:opacity-80 transition-opacity">
            About Us
          </Link>
        </div>

        {/* Center: Copyright Text */}
        {/* 2. Apply absolute positioning to perfectly center the text */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <p>&copy; {new Date().getFullYear()} Simple Home Offer. All Rights Reserved.</p>
        </div>

        {/* Right Side: Contact Info */}
        <div className="text-right">
          <p>
            <a href="mailto:contact@simplehomeoffer.org" className="hover:opacity-80 transition-opacity">
              contact@simplehomeoffer.org
            </a>
          </p>
          <p>
            <a href="tel:+18005551234" className="hover:opacity-80 transition-opacity">
              (800) 555-1234
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}