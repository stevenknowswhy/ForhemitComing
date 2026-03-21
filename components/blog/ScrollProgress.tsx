"use client";

import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed left-4 top-0 bottom-0 w-0.5 bg-border-light hidden lg:block z-30"
      data-analytics-threshold="25,50,75,90"
    >
      <div 
        className="w-full bg-sage transition-all duration-100"
        style={{ height: `${progress}%` }}
      />
    </div>
  );
}
