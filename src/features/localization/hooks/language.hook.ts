import { useTranslation } from 'react-i18next'
import { Language } from '../types'

export const useLanguage = () => {
  const { i18n } = useTranslation()

  const currentLanguage = i18n.language as Language

  return { currentLanguage }
}
