// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    // Increased padding slightly for a better mobile layout
    <footer className="sticky bottom-0 w-full bg-gradient-to-b from-[#001429] to-[#002952] text-[#f5c77e] p-6 z-20">
      {/*
        - Stacks items vertically on mobile (flex-col) and adds a gap
        - Switches to a horizontal row on medium screens and up (md:flex-row)
      */}
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm gap-4 md:gap-0">
        
        {/* Left Side: About Us Button */}
        <div className="text-center md:text-left">
          <Link href="/about" className="hover:opacity-80 transition-opacity">
            About Us
          </Link>
        </div>

        {/* Center: Copyright Text */}
        {/*
          - On mobile, this is a normal block in the flex column
          - On medium screens up, it becomes absolutely positioned to be perfectly centered
        */}
        <div className="order-first md:order-none md:absolute md:left-1/2 md:-translate-x-1/2 text-center">
          <p>&copy; {new Date().getFullYear()} Simple Home Offer. All Rights Reserved.</p>
        </div>

        {/* Right Side: Contact Info */}
        {/*
          - Centers text on mobile (text-center)
          - Aligns text to the right on medium screens and up (md:text-right)
        */}
        <div className="text-center md:text-right">
          <p>
            <a href="mailto:simplehomeoffer33@gmail.com" className="hover:opacity-80 transition-opacity">
              simplehomeoffer33@gmail.com
            </a>
          </p>
          <p>
            <a href="tel:+(coming soon)" className="hover:opacity-80 transition-opacity">
              +1 (856) 123-4567 (coming soon)
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}