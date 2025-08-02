import React from 'react';

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      'inline-flex items-center justify-center rounded font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
      variants[variant],
      sizes[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    if (asChild && React.isValidElement(children)) {
      const childProps = children.props as React.HTMLAttributes<HTMLElement> & {
        className?: string;
      };
      return React.cloneElement(children as React.ReactElement<any>, {
        ...props,
        ref: ref as any,
        className: `${buttonClasses} ${childProps.className || ''}`.trim(),
      });
    }

    return (
      <button className={buttonClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
