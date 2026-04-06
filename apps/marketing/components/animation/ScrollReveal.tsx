"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: string;
  delay?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ animation, delay });

  return (
    <div
      ref={ref}
      className={className}
      data-animate={animation}
      data-delay={delay}
      data-visible={isVisible}
    >
      {children}
    </div>
  );
}
