import { FC, useCallback } from 'react'
import { Heading } from '../../../components/Heading/Heading'
import { useStoryStore } from '../storyStore'
import { IStory } from '../type'
import styles from './StoryForm.module.scss'

type StoryProps = {
  story: IStory
}

export const StoryForm: FC<StoryProps> = ({ story }) => {
  const { updateStory } = useStoryStore()

  const handleTitleUpdate = useCallback(
    (title: string) => {
      updateStory(story.id, { ...story, title })
    },
    [story, updateStory],
  )

  if (!story) return null

  return (
    <article className={styles.story}>
      <Heading isCentered title={story.title} onChange={handleTitleUpdate} />

      <div className={styles.content}>
        <div className={styles.empty}>No content yet</div>
      </div>
    </article>
  )
}
