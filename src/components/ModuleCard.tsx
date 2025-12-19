import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { type Module } from '@/lib/storage';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  module: Module;
  progress?: number;
  onClick?: () => void;
  variant?: 'default' | 'compact';
}

export function ModuleCard({ module, progress = 0, onClick, variant = 'default' }: ModuleCardProps) {
  const { t } = useLanguage();

  // Dynamic icon component
  const IconComponent = (Icons[module.icon as keyof typeof Icons] as LucideIcon) || Icons.BookOpen;

  const isCompleted = progress === 100;

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className="module-card group text-left w-full"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isCompleted ? 'success-gradient' : 'hero-gradient'
          } group-hover:scale-110`}>
            <IconComponent className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{t(module.title)}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progress}%`,
                    background: isCompleted 
                      ? 'var(--gradient-success)' 
                      : 'var(--gradient-accent)'
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="module-card group text-left w-full"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
        isCompleted ? 'success-gradient' : 'hero-gradient'
      } group-hover:scale-110 group-hover:shadow-glow`}>
        <IconComponent className="w-7 h-7 text-primary-foreground" />
      </div>
      
      <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
        {t(module.title)}
      </h3>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {t(module.description)}
      </p>

      <div className="flex items-center gap-3">
        <div className="flex-1 progress-bar">
          <div 
            className="progress-bar-fill"
            style={{ 
              width: `${progress}%`,
              background: isCompleted 
                ? 'var(--gradient-success)' 
                : 'var(--gradient-accent)'
            }}
          />
        </div>
        <span className={`text-sm font-medium ${isCompleted ? 'text-success' : 'text-muted-foreground'}`}>
          {Math.round(progress)}%
        </span>
      </div>

      {isCompleted && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 rounded-full success-gradient flex items-center justify-center">
            <Icons.Check className="w-4 h-4 text-success-foreground" />
          </div>
        </div>
      )}
    </button>
  );
}
