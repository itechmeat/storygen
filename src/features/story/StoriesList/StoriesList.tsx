import { FC } from 'react'
import { Button, Result } from 'antd'
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
  if (!list.length) {
    return (
      <Result
        status="404"
        title="No stories yet"
        subTitle="You can create your first story"
        extra={
          <Button type="primary" onClick={onStart}>
            Start writing
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
