import { FC, useCallback } from 'react'
import { Heading } from '../../../components/Heading/Heading'
import { Spinner } from '../../../components/Spinner/Spinner'
import { StoryForm } from '../StoryForm/StoryForm'
import { StoryResponse } from '../StoryResponse/StoryResponse'
import { IStory, StoryOptions } from '../type'
import styles from './Story.module.scss'

type StoryProps = {
  story: IStory
  isStoryGenerating: boolean
  onUpdate: (story: IStory) => void
  onStoryGenerate: (story: IStory) => void
  onStoryCancel: () => void
  onScenesGenerate: () => void
}

export const Story: FC<StoryProps> = ({
  story,
  isStoryGenerating,
  onUpdate,
  onStoryGenerate,
  onStoryCancel,
  onScenesGenerate,
}) => {
  const handleTitleUpdate = useCallback(
    (title: string) => {
      onUpdate({ ...story, title })
    },
    [onUpdate, story],
  )

  const handleStoryGenerate = useCallback(
    (options: StoryOptions) => {
      onUpdate({ ...story, ...options })
      onStoryGenerate({ ...story, ...options })
    },
    [onStoryGenerate, onUpdate, story],
  )

  if (!story) return null

  return (
    <article className={styles.story}>
      <Heading isCentered title={story.title} onChange={handleTitleUpdate} />

      <div className={styles.content}>
        {!story.response ? (
          <StoryForm story={story} onGenerate={handleStoryGenerate} />
        ) : (
          <StoryResponse
            response={story.response}
            onCancel={onStoryCancel}
            onGenerate={onScenesGenerate}
          />
        )}
      </div>
      {isStoryGenerating && <Spinner />}
    </article>
  )
}
