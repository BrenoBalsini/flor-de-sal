'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Idioma, translations } from '../locales/translations';

// ✅ Tipo do 't' aceita PT ou EN
type Traducoes = typeof translations[Idioma];

interface LanguageContextType {
  idioma: Idioma;
  t: Traducoes;
  setIdioma: (idioma: Idioma) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdiomaState] = useState<Idioma>('en');

  useEffect(() => {
    const salvo = localStorage.getItem('idioma') as Idioma | null;
    if (salvo === 'pt' || salvo === 'en') {
      setIdiomaState(salvo);
    }
  }, []);

  const setIdioma = (novoIdioma: Idioma) => {
    setIdiomaState(novoIdioma);
    localStorage.setItem('idioma', novoIdioma);
  };

  return (
    <LanguageContext.Provider value={{ idioma, t: translations[idioma], setIdioma }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
