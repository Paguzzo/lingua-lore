import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationPT from './locales/pt.json';
import translationES from './locales/es.json';
import translationEN from './locales/en.json';

const resources = {
  pt: {
    translation: translationPT
  },
  es: {
    translation: translationES
  },
  en: {
    translation: translationEN
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Ordem de detecção: localStorage primeiro, depois navegador, depois subdomain, depois path
      order: ['localStorage', 'navigator', 'subdomain', 'path', 'htmlTag'],
      // Cache no localStorage
      caches: ['localStorage'],
      // Não detectar a partir de cookies por questões de privacidade
      excludeCacheFor: ['cimode'],
      // Configurações para detecção por navegador
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      // Converter códigos de idioma
      convertDetectedLanguage: (lng: string) => {
        // Converter códigos de idioma para nossos códigos suportados
        if (lng.startsWith('pt')) return 'pt';
        if (lng.startsWith('es')) return 'es';
        if (lng.startsWith('en')) return 'en';
        return lng;
      }
    },
    // Configurações de carregamento
    load: 'languageOnly',
    cleanCode: true,
    // Configurações de namespace
    defaultNS: 'translation',
    ns: ['translation'],
    // Configurações de reação a mudanças
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    }
  });

export default i18n;