import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'en' | 'ta' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T>(obj: Record<string, T> | undefined) => T | string;
}

const languageNames: Record<Language, string> = {
  en: 'English',
  ta: 'தமிழ்',
  hi: 'हिंदी',
  te: 'తెలుగు',
};

export { languageNames };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('delphi_tvs_language');
    return (saved as Language) || 'en';
  });

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('delphi_tvs_language', lang);
  }, []);

  const t = useCallback(<T,>(obj: Record<string, T> | undefined): T | string => {
    if (!obj) return '';
    return obj[language] ?? obj['en'] ?? '';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
