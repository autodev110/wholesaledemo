// src/hooks/useMobileDetection.ts
import { useState, useEffect } from 'react';

// Tailwind's 'md' breakpoint is 768px.
const MEDIUM_BREAKPOINT = 768; 

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if the current width is less than the medium breakpoint
    const checkIsMobile = () => {
      // Use window.innerWidth for client-side screen width
      // We check if window is defined before accessing it (Next.js/SSR safety)
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < MEDIUM_BREAKPOINT);
      }
    };

    // Initial check
    checkIsMobile();

    // Set up event listener for window resizing
    window.addEventListener('resize', checkIsMobile);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []); // Empty dependency array ensures this runs only once on mount

  return isMobile;
}