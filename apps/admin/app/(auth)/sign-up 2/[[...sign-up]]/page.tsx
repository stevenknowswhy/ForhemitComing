'use client';

import { SignUp } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function SignUpPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forhemit Admin</h1>
          <p className="text-gray-600">Create an account to access the admin panel</p>
        </div>
        {isReady && (
          <SignUp 
            routing="path"
            path="/sign-up"
            fallbackRedirectUrl="/admin"
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-gray-900 hover:bg-gray-800 text-white',
                card: 
                  'bg-white shadow-lg border border-gray-200',
                captchaContainer: 'hidden',
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
