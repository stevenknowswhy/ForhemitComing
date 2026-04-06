/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        parchment: 'var(--parchment)',
        ink: 'var(--ink)',
        stone: 'var(--stone)',
        'stone-light': 'var(--stone-light)',
        sage: {
          DEFAULT: 'var(--sage)',
          light: 'var(--sage-light)',
          muted: 'var(--sage-muted)',
        },
        'alert-clay': 'var(--alert-clay)',
        'deep-dive': 'var(--deep-dive-bg)',
        'deep-slate': 'var(--deep-slate)',
        /* shadcn/ui CSS variable colors */
        border: {
          DEFAULT: "var(--border)",
          light: 'var(--border-light)',
          medium: 'var(--border-medium)',
        },
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '300' }],
        'h1': ['clamp(2rem, 4vw, 2.625rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '400' }],
        'h2': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3', fontWeight: '500' }],
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['1.0625rem', { lineHeight: '1.7' }],
        'ui': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
        'meta': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'pull': ['1.5rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '128': '32rem',
      },
      maxWidth: {
        'content': '45rem',
        'reading': '45rem',
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(26,26,24,0.04)',
        'hover': '0 8px 24px rgba(26,26,24,0.08)',
        'elevated': '0 12px 32px rgba(26,26,24,0.12)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '300': '300ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'progress-fill': 'progressFill 0.3s ease-out forwards',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progressFill: {
          '0%': { height: '0%' },
          '100%': { height: 'var(--progress)' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
