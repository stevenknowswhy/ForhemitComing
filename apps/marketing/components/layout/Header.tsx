"use client";

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-canvas/95 backdrop-blur-sm border-b border-border-light z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-wide text-sage font-semibold">
              FORHEMIT
            </span>
            <span className="text-xs text-stone-light uppercase tracking-wider hidden sm:inline">
              Capital
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/blog" className="text-sm font-medium text-ink hover:text-sage transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-sm font-medium text-ink hover:text-sage transition-colors">
              About
            </Link>
            <Link 
              href="/?early=true" 
              className="text-sm font-medium text-sage hover:text-sage/80 transition-colors"
            >
              Get Early Access
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-stone hover:text-sage"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border-light">
            <div className="flex flex-col gap-4">
              <Link 
                href="/blog" 
                className="text-sm font-medium text-ink hover:text-sage"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/about" 
                className="text-sm font-medium text-ink hover:text-sage"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/?early=true" 
                className="text-sm font-medium text-sage"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Early Access
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
