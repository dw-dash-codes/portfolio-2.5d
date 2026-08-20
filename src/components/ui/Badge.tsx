import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sand' | 'navy' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'outline',
  className = '',
}) => {
  const variantStyles = {
    outline: 'border border-sand-400/30 text-sand-200 bg-navy-900/40 backdrop-blur-sm',
    sand: 'bg-sand-400/20 text-sand-50 border border-sand-200/40',
    navy: 'bg-navy-800 text-sand-50 border border-navy-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-mono tracking-wider uppercase transition-colors ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
