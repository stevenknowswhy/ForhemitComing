'use client';

import { SignIn, useClerk } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function SignInPage() {
  const { client } = useClerk();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure Clerk is fully loaded
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forhemit Admin</h1>
          <p className="text-gray-600">Sign in to access the CRM and templates</p>
        </div>
        {isReady && (
          <SignIn 
            routing="path"
            path="/sign-in"
            fallbackRedirectUrl="/admin"
            // Disable bot protection for local dev
            {...(process.env.NODE_ENV === 'development' && {
              __unstable_disableDevelopmentLogging: true,
            })}
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-gray-900 hover:bg-gray-800 text-white',
                card: 
                  'bg-white shadow-lg border border-gray-200',
                // Hide CAPTCHA container if it fails to load
                captchaContainer: 'hidden',
              },
            }}
          />
        )}
        <p className="mt-4 text-center text-sm text-gray-500">
          Having trouble? Try using a different browser or check your Clerk dashboard settings.
        </p>
      </div>
    </div>
  );
}
