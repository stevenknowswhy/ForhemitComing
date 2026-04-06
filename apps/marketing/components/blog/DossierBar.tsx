"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/CustomButton';
import { useScrollDepth } from '@/hooks/useBlog';

interface DossierBarProps {
  pathway: string;
}

export function DossierBar({ pathway }: DossierBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [email, setEmail] = useState('');
  const [walkthrough, setWalkthrough] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useScrollDepth([75]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      if (scrollPercent >= 75 && !isMinimized) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMinimized]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[CRM] Dossier download:', {
      email,
      role: pathway,
      walkthroughRequested: walkthrough,
      timestamp: new Date().toISOString()
    });
    
    setIsSubmitted(true);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsVisible(false);
  };

  if (!isVisible && !isMinimized) return null;

  return (
    <>
      {isMinimized && (
        <button
          onClick={() => { setIsMinimized(false); setIsVisible(true); }}
          className="fixed bottom-4 right-4 bg-sage text-white px-4 py-2 rounded-full shadow-elevated z-50 flex items-center gap-2 text-sm font-medium hover:bg-[#3d5543] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Dossier
        </button>
      )}

      <div 
        className={`
          fixed bottom-0 left-0 right-0 bg-deep-dive text-white 
          shadow-elevated z-40 transform transition-transform duration-400 cubic-bezier(0.4, 0, 0.2, 1)
          ${isVisible && !isMinimized ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          {/* Close button — always visible top-right on mobile */}
          <button
            type="button"
            onClick={handleMinimize}
            className="absolute top-3 right-3 p-1.5 text-white/50 hover:text-white transition-colors sm:hidden"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 pr-8 sm:pr-0">
              <h3 className="font-serif text-lg sm:text-xl mb-1">Continue your research</h3>
              <p className="text-white/70 text-sm">Download the complete framework and supporting materials</p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="w-full md:w-auto space-y-3 md:space-y-0 md:flex md:items-center md:gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full md:w-auto bg-white/10 border border-white/20 rounded-md px-4 py-2.5 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 text-sm"
                />
                <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={walkthrough}
                    onChange={(e) => setWalkthrough(e.target.checked)}
                    className="rounded border-white/30 bg-white/10"
                  />
                  <span className="leading-tight">Have a specialist walk me through this</span>
                </label>
                <div className="flex items-center gap-3">
                  <Button 
                    type="submit" 
                    variant="alert"
                    size="md"
                  >
                    Download
                  </Button>
                  <button
                    type="button"
                    onClick={handleMinimize}
                    className="text-white/50 hover:text-white text-sm hidden sm:inline"
                  >
                    Dismiss
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <span className="text-white/70 text-sm">Check your email for the download link.</span>
                <Button variant="secondary" size="sm" onClick={handleMinimize}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
