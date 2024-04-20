import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import enTranslations from './locales/en'
import ruTranslations from './locales/ru'

const languageDetector = new LanguageDetector(null, {
  lookupLocalStorage: 'language',
  order: ['localStorage'],
})

i18n
  .use(Backend)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      ru: { translation: ruTranslations },
    },
    fallbackLng: 'en',
    debug: false,
  })

export default { i18n }
