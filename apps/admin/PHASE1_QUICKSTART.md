# Phase 1 Quick-Start Guide

Ready-to-copy code for Phase 1 implementation.  
**Start here after reading IMPLEMENTATION_ROADMAP.md**

---

## Step 1: Install Dependencies

```bash
npm install isomorphic-dompurify zod
```

---

## Step 2: Create Error Boundary

**File**: `app/components/ErrorBoundary.tsx`

```tsx
"use client";

import React, { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
    // TODO: Send to error tracking service in Phase 4
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#0e0e0c",
              color: "#f5f0e8",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#FF6B00" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#a0a0a0", marginBottom: "2rem", maxWidth: "500px" }}>
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.75rem 1.5rem",
                background: "transparent",
                border: "1px solid #FF6B00",
                color: "#FF6B00",
                cursor: "pointer",
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Reload Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

---

## Step 3: Update Layout

**File**: `app/layout.tsx` (additions only)

```tsx
// ADD THIS IMPORT
import { ErrorBoundary } from './components/ErrorBoundary'

// WRAP THE CONTENT in default export:
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmMono.variable} ${outfit.variable} ${inter.variable}`} suppressHydrationWarning data-scroll-behavior="auto">
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <ConvexClientProvider>
            <Navigation />
            {children}
            <GlobalFooter />
          </ConvexClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

**Test**: Temporarily add `throw new Error("test")` to any page, verify error boundary shows.

---

## Step 4: Fix XSS in InfrastructureAuditModal

**File**: `app/components/modals/InfrastructureAuditModal.tsx`

Add import at top:
```tsx
import DOMPurify from 'isomorphic-dompurify';
```

Find the `dangerouslySetInnerHTML` usage (around line 503) and replace:

```tsx
// BEFORE:
<div dangerouslySetInnerHTML={{ __html: diagnostic }} />

// AFTER:
const sanitizedDiagnostic = React.useMemo(() => 
  DOMPurify.sanitize(diagnostic), 
  [diagnostic]
);
// ...
<div dangerouslySetInnerHTML={{ __html: sanitizedDiagnostic }} />
```

**Test**: Complete audit flow, verify text displays correctly.

---

## Step 5: Fix Memory Leaks

### 5.1 EarlyAccessForm.tsx

Replace the setTimeout (around line 69):

```tsx
// BEFORE:
setTimeout(() => {
  handleClose();
}, 2000);

// AFTER:
React.useEffect(() => {
  if (status === "success") {
    const timer = setTimeout(() => {
      handleClose();
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [status, handleClose]);
```

### 5.2 GalleryContainer.tsx

Replace the setTimeout (around line 43):

```tsx
// BEFORE:
setTimeout(() => {
  setIsTransitioning(false);
}, prefersReducedMotion ? 0 : 500);

// AFTER:
React.useEffect(() => {
  if (isTransitioning) {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, prefersReducedMotion ? 0 : 500);
    return () => clearTimeout(timer);
  }
}, [isTransitioning, prefersReducedMotion]);
```

**Note**: This changes behavior slightly - may need to refactor the goToSlide function to work with this pattern.

**Alternative fix** (less invasive) - use ref:
```tsx
// Add to component:
const timeoutRef = React.useRef<NodeJS.Timeout>();

// In goToSlide:
timeoutRef.current = setTimeout(() => {
  setIsTransitioning(false);
}, prefersReducedMotion ? 0 : 500);

// In cleanup:
React.useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);
```

---

## Step 6: Environment Validation

**File**: `app/components/providers/ConvexProvider.tsx`

Replace with:

```tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useState, useEffect } from "react";

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  
  if (!url) {
    const error = new Error(
      "Missing NEXT_PUBLIC_CONVEX_URL environment variable. " +
      "Please check your .env.local file and ensure Convex is configured."
    );
    console.error(error.message);
    throw error;
  }
  
  return new ConvexReactClient(url);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => getConvexClient());
  
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
```

---

## Step 7: Create Validation Schema

**File**: `lib/validation.ts` (create new file)

```tsx
import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");

export const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, "Phone number must be 10 digits")
  .optional()
  .or(z.literal(""));

export const contactFormSchema = z.object({
  contactType: z.enum([
    "business-owner",
    "partner", 
    "existing-business",
    "website-visitor",
    "marketing"
  ]),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().max(200).optional(),
  interest: z.enum([
    "esop-transition",
    "accounting",
    "legal",
    "lending",
    "broker",
    "wealth",
    "career",
    "general"
  ]).optional(),
  message: z.string().min(1, "Message is required").max(5000),
});

export const earlyAccessSchema = z.object({
  email: emailSchema,
});

export const jobApplicationSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: emailSchema,
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  position: z.string().min(1),
  otherPosition: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type EarlyAccessData = z.infer<typeof earlyAccessSchema>;
export type JobApplicationData = z.infer<typeof jobApplicationSchema>;
```

---

## Verification Commands

```bash
# 1. Type check
npx tsc --noEmit

# 2. Build
npm run build

# 3. Dev server
npm run dev
```

---

## Phase 1 Complete When:

- [ ] All files modified above
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Error boundary tested
- [ ] XSS fix verified (check HTML sanitization in DevTools)
- [ ] Memory leak fixes tested (React DevTools Profiler)
- [ ] Environment validation tested (temporarily break env var)

**Then**: Commit with message: `feat(security): Phase 1 - error boundaries, XSS fix, memory leak fixes`

---

## Next Steps

After Phase 1 is complete and verified, proceed to **IMPLEMENTATION_ROADMAP.md** for Phase 2 instructions.
