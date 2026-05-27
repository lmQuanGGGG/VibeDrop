"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

export function MobileNavWrapper({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // The scrollable container is the middle-content-area div
    const scrollEl = document.getElementById("middle-content-area");
    if (!scrollEl) return;

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = scrollEl.scrollTop;
        const delta = currentY - lastScrollY.current;

        // Show when scrolling DOWN (delta > 0), hide when scrolling UP (delta < 0)
        if (delta > 8) {
          // Scrolling down — hide nav
          setVisible(false);
        } else if (delta < -8) {
          // Scrolling up — show nav
          setVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {children}
    </div>
  );
}
