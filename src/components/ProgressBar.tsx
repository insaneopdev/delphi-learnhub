import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'accent-gradient',
    success: 'success-gradient',
    warning: 'bg-warning',
    destructive: 'bg-destructive',
  };

  return (
    <div className="w-full">
      <div className={`w-full rounded-full bg-muted overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full ${variantClasses[variant]} ${
            animated ? 'transition-all duration-500 ease-out' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
}
