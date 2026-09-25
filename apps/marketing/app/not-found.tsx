import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

import { GoBackButton } from './components/ui/GoBackButton';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    "The page you're looking for doesn't exist or has been moved. Return to Forhemit — 100% employee ownership succession for founder-led businesses.",
  openGraph: {
    title: 'Page Not Found',
    description:
      "The page you're looking for doesn't exist or has been moved. Return to Forhemit — 100% employee ownership succession for founder-led businesses.",
  },
};

export default function NotFound() {
  return (
    <main className="not-found-hero">
      <div className="not-found-content">
        <p className="not-found-code" aria-hidden="true">
          404
        </p>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-message">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="not-found-actions">
          <Link href="/" className="not-found-button primary touch-target">
            <Home size={18} />
            <span>Go Home</span>
          </Link>
          <GoBackButton />
        </div>

        <div className="not-found-links">
          <p className="not-found-hint">Or explore:</p>
          <nav className="not-found-nav" aria-label="Core pages">
            <Link href="/signal-os">Signal OS</Link>
            <Link href="/business-owners">Business Owners</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
