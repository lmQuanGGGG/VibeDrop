import { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  speed?: "normal" | "slow";
  gap?: string;
  className?: string;
};

export function Marquee({ children, speed = "normal", gap = "gap-4", className = "" }: MarqueeProps) {
  return (
    <div className={`overflow-hidden w-full flex ${className}`}>
      <div 
        className={`flex w-max min-w-full shrink-0 flex-nowrap hover:[animation-play-state:paused] items-center ${gap} ${
          speed === "slow" ? "animate-marquee-slow" : "animate-marquee"
        }`}
      >
        {/* Render children twice to create a seamless infinite loop */}
        {children}
        {children}
      </div>
    </div>
  );
}
