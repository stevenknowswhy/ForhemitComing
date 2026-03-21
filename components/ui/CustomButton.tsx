import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'alert' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-light disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-sage text-white hover:bg-[#3d5543] active:scale-[0.98]',
      secondary: 'bg-transparent border border-sage text-sage hover:bg-sage hover:text-white',
      alert: 'bg-alert-clay text-white hover:bg-[#a06a4d] active:scale-[0.98]',
      ghost: 'bg-transparent text-sage hover:bg-sage/10',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
