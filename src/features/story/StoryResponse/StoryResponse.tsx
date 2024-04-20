import { FC } from 'react'
import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { CompactShortScene } from '../type'
import styles from './StoryResponse.module.scss'

type Props = {
  response: CompactShortScene[]
  onCancel: () => void
  onGenerate: () => void
}

export const StoryResponse: FC<Props> = ({ response, onCancel, onGenerate }) => {
  const { t } = useTranslation()

  const isWrongFormat = !Array.isArray(response)

  return (
    <div className={styles.response}>
      <h2 className={styles.h2}>{t('StoryPage.generatedScenes')}</h2>

      {!isWrongFormat ? (
        <ul className={styles.list}>
          {response?.map((scene, index) => (
            <li key={index} className={styles.chapter}>
              <h3 className={styles.title}>{scene.t}</h3>
              <p className={styles.paragraph}>{scene.d}</p>
            </li>
          ))}
        </ul>
      ) : (
        <Result
          status="warning"
          title="Format of the answer is wrong"
          extra={
            <Button type="primary" onClick={onGenerate}>
              Try again
            </Button>
          }
        />
      )}

      <footer className={styles.footer}>
        <Button onClick={onCancel}>{t('StoryPage.regenerate')}</Button>
        <Button type="primary" onClick={onGenerate}>
          {t('StoryPage.generateFullStory')}
        </Button>
      </footer>
    </div>
  )
}
