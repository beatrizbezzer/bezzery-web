import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '../locales/en.json'
import ptBR from '../locales/pt-BR.json'
import es from '../locales/es.json'
import fr from '../locales/fr.json'

const savedLanguage = localStorage.getItem('bz_language')

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'pt-BR': { translation: ptBR },
      es: { translation: es },
      fr: { translation: fr },
    },
    lng: savedLanguage || undefined,
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt-BR', 'es', 'fr'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'bz_language',
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
