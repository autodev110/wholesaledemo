// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    // 1. Replaced background/border with the navy gradient
    // 2. Added the new text color
    <footer className="sticky bottom-0 w-full bg-gradient-to-b from-[#002952] to-[#001429] text-[#f5c77e] p-4 z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
        
        {/* Left Side: About Us Button */}
        <div>
          {/* 3. Updated hover effect for the new text color */}
          <Link href="/about" className="hover:opacity-80 transition-opacity">
            About Us
          </Link>
        </div>

        {/* Center: Copyright Text */}
        <div className="text-center">
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