import Link from "next/link";

export function BlogFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-parchment border-t border-border-light py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-serif text-xl tracking-wide text-sage font-semibold">
                FORHEMIT
              </span>
            </Link>
            <p className="text-stone text-sm max-w-md">
              A Public Benefit Corporation specializing in business continuity, 
              succession planning, and stewardship transitions.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-ink mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-stone hover:text-sage transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-stone hover:text-sage transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/?early=true" className="text-sm text-stone hover:text-sage transition-colors">
                  Get Early Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-ink mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:hello@forhemit.com" 
                  className="text-sm text-stone hover:text-sage transition-colors"
                >
                  hello@forhemit.com
                </a>
              </li>
              <li className="text-sm text-stone">
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-meta text-stone-light">
            © {currentYear} Forhemit PBC PBC. All rights reserved.
          </p>
          <div className="flex gap-4 text-meta text-stone-light">
            <Link href="/privacy" className="hover:text-sage transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-sage transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
