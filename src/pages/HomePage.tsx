import { useEffect } from 'react'
import { ThunderboltOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SUPPORTED_LANGUAGES } from '../features/localization/constants'
import { Language } from '../features/localization/types'
import { UserKeysNames } from '../features/user/types'
import { useUserStore } from '../features/user/userStore'

export const HomePage = () => {
  const { i18n, t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { updateKey } = useUserStore()

  useEffect(() => {
    const lang = searchParams.get('lang') as Language
    const keyOpenAIapi = searchParams.get('keyOpenAIapi')
    const keyTogetherAIapi = searchParams.get('keyTogetherAIapi')
    if (lang && SUPPORTED_LANGUAGES.includes(lang)) {
      i18n.changeLanguage(lang)
    }
    if (keyOpenAIapi) {
      updateKey(UserKeysNames.OpenAIKeyName, keyOpenAIapi)
    }
    if (keyTogetherAIapi) {
      updateKey(UserKeysNames.TogetherAIKeyName, keyTogetherAIapi)
    }
    if (keyOpenAIapi || keyTogetherAIapi || lang) {
      setTimeout(() => {
        navigate('/stories')
      }, 0)
    }
  }, [i18n, navigate, searchParams, updateKey])

  return (
    <div>
      <Result
        icon={<ThunderboltOutlined />}
        title={t('HomePage.title')}
        extra={
          <Button type="primary" href="/stories">
            {t('HomePage.cta')}
          </Button>
        }
      />
    </div>
  )
}
