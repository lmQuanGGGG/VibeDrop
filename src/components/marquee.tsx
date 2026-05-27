import { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  speed?: "normal" | "slow";
  gap?: string;
  className?: string;
};

export function Marquee({ children, speed = "normal", gap = "gap-4", className = "" }: MarqueeProps) {
  const duration = speed === "slow" ? "40s" : "25s";

  return (
    <div className={`overflow-hidden w-full flex ${className}`}>
      <div 
        className={`flex w-max min-w-full shrink-0 flex-nowrap hover:[animation-play-state:paused] items-center ${gap}`}
        style={{ animation: `marquee ${duration} linear infinite` }}
      >
        {/* Render children twice to create a seamless infinite loop */}
        {children}
        {children}
      </div>
    </div>
  );
}
