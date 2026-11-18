import type { Metadata } from 'next';

// Import blog styles directly in layout
import './blog-globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Insights | Forhemit',
    template: '%s | Forhemit',
  },
  description:
    "Two essays by Stefano Stokes, Forhemit's founder, on the exit crisis facing retiring founders and the philosophy that answers it.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
