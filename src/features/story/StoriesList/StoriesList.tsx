import { FC } from 'react'
import { Button, Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { UUID } from '../../../types/common'
import { StoryCard } from '../StoryCard/StoryCard'
import { IStory } from '../type'
import styles from './StoriesList.module.scss'

type Props = {
  list: IStory[]
  onStart: () => void
  onStoryDelete?: (id: UUID) => void
}

export const StoriesList: FC<Props> = ({ list, onStart, onStoryDelete }) => {
  const { t } = useTranslation()

  if (!list.length) {
    return (
      <Result
        status="404"
        title={t('notFound.stories.title')}
        subTitle={t('notFound.stories.subTitle')}
        extra={
          <Button type="primary" onClick={onStart}>
            {t('notFound.stories.cta')}
          </Button>
        }
      />
    )
  }

  return (
    <div className={styles.list}>
      {list.map(story => (
        <StoryCard story={story} key={story.id} onDelete={onStoryDelete} />
      ))}
    </div>
  )
}
