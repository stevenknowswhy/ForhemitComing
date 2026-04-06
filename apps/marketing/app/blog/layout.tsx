import type { Metadata } from 'next';
import { BlogHeader } from './_components/BlogHeader';
import { BlogFooter } from './_components/BlogFooter';
import { BlogThemeProvider } from './_components/BlogThemeProvider';
import { PathwayProvider } from '@/components/blog/PathwayProvider';

// Import blog styles directly in layout
import './blog-globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Blog | Forhemit PBC',
    template: '%s | Forhemit PBC',
  },
  description: 'Institutional intelligence for business transitions and legacy preservation.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlogThemeProvider>
      <PathwayProvider>
        <div className="blog-standalone min-h-screen bg-canvas transition-colors duration-300">
          <BlogHeader />
          {children}
          <BlogFooter />
        </div>
      </PathwayProvider>
    </BlogThemeProvider>
  );
}

