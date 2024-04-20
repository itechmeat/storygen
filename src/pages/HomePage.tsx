import { useEffect } from 'react'
import { ThunderboltOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UserKeysNames } from '../features/user/types'
import { useUserStore } from '../features/user/userStore'

export const HomePage = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { updateKey } = useUserStore()

  useEffect(() => {
    const keyOpenAIapi = searchParams.get('keyOpenAIapi')
    const keyTogetherAIapi = searchParams.get('keyTogetherAIapi')
    if (keyOpenAIapi) {
      updateKey(UserKeysNames.OpenAIKeyName, keyOpenAIapi)
    }
    if (keyTogetherAIapi) {
      updateKey(UserKeysNames.TogetherAIKeyName, keyTogetherAIapi)
    }
    if (keyOpenAIapi || keyTogetherAIapi) {
      setTimeout(() => {
        navigate('/stories')
      }, 0)
    }
  }, [navigate, searchParams, updateKey])

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
