import { FC } from 'react'
import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { IScene } from '../type'
import styles from './ScenesList.module.scss'

type Props = {
  list: IScene[]
  generatedScene: string | null
  isStoryGenerating: boolean
  isSummaryGenerating: boolean
}

export const ScenesList: FC<Props> = ({
  list,
  generatedScene,
  isStoryGenerating,
  isSummaryGenerating,
}) => {
  const { t } = useTranslation()

  return (
    <>
      {isStoryGenerating && (
        <h1 className={styles.genTitle}>
          {t('StoryPage.generatingScene')} <Spin />
        </h1>
      )}

      {list?.map((scene, index) => (
        <section key={index} className={styles.scene}>
          <h3 className={styles.title}>{scene.title}</h3>
          <p className={styles.paragraph}>{scene.content}</p>
        </section>
      ))}

      {generatedScene && (
        <section className={styles.scene}>
          <h3 className={styles.title}>
            {!isSummaryGenerating ? 'Генерируем новый эпизод...' : 'Придумываем название...'}
          </h3>
          <p className={styles.paragraph}>{generatedScene}</p>
        </section>
      )}
    </>
  )
}
