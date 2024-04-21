import { FC } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useStoryStore } from '../storyStore'
import { IStory } from '../type'
import styles from './StoryMeta.module.scss'

type Props = {
  story: IStory
  isGenerating: boolean
}

export const StoryMeta: FC<Props> = ({ story }) => {
  const { t } = useTranslation()
  const { updateStory } = useStoryStore()

  const handleRemoveMeta = async () => {
    const update = {
      ...story,
      names: [],
      description: '',
      summary: '',
    }

    await updateStory(story.id, update)
  }

  return (
    <div className={styles.meta}>
      <div className={styles.poster}>
        {story.description && <h3 className={styles.description}>{story.description}</h3>}
        <p>
          <q className={styles.quote}>{story.summary}</q>
        </p>
      </div>

      <div className={styles.actions}>
        <Button danger icon={<DeleteOutlined />} onClick={handleRemoveMeta}>
          {t('StoryPage.removeMetaData')}
        </Button>
      </div>
    </div>
  )
}
