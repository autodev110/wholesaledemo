// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="sticky bottom-0 w-full bg-white border-t border-gray-200 p-4 z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-600">
        
        {/* Left Side: About Us Button */}
        <div>
          <Link href="/about" className="hover:text-indigo-600 transition-colors">
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
            <a href="mailto:contact@simplehomeoffer.org" className="hover:text-indigo-600">
              contact@simplehomeoffer.org
            </a>
          </p>
          <p>
            <a href="tel:+18005551234" className="hover:text-indigo-600">
              (800) 555-1234
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}