'use client';

interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  return (
    <div 
      className={`fixed bottom-5 right-5 bg-[#0E1C2F] text-white px-4 py-2.5 rounded-lg text-xs shadow-lg z-[300] transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
