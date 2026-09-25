'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function GoBackButton() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // history.length counts the current entry; > 1 means this tab has a page behind it.
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleGoBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      // Direct arrival with no in-tab history: server-navigate home instead.
      router.push('/');
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoBack}
      className="not-found-button ghost touch-target"
    >
      <ArrowLeft size={18} />
      <span>Go Back</span>
    </button>
  );
}
