import { FC } from 'react'
import { UUID } from '../../../types/common'
import { StoryCard } from '../StoryCard/StoryCard'
import { IStory } from '../type'
import styles from './StoriesList.module.scss'

type Props = {
  list: IStory[]
  onStoryDelete?: (id: UUID) => void
}

export const StoriesList: FC<Props> = ({ list, onStoryDelete }) => {
  if (!list.length) {
    return <div>No stories yet</div>
  }

  return (
    <div className={styles.list}>
      {list.map(story => (
        <StoryCard story={story} key={story.id} onDelete={onStoryDelete} />
      ))}
    </div>
  )
}
