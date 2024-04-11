import { FC, useCallback, useMemo } from 'react'
import { Heading } from '../../../components/Heading/Heading'
import { Spinner } from '../../../components/Spinner/Spinner'
import { ScenesList } from '../../scene/ScenesList/ScenesList'
import { useSceneStore } from '../../scene/sceneStore'
import { IScene } from '../../scene/type'
import { StoryForm } from '../StoryForm/StoryForm'
import { StoryResponse } from '../StoryResponse/StoryResponse'
import { IStory, ShortScene, StoryOptions } from '../type'
import styles from './Story.module.scss'

type StoryProps = {
  story: IStory
  isStoryGenerating: boolean
  formattedResponse: ShortScene[] | null
  onUpdate: (story: IStory) => void
  onStoryGenerate: (story: IStory) => void
  onStoryCancel: () => void
  onScenesGenerate: () => void
}

export const Story: FC<StoryProps> = ({
  story,
  isStoryGenerating,
  formattedResponse,
  onUpdate,
  onStoryGenerate,
  onStoryCancel,
  onScenesGenerate,
}) => {
  const { getSceneById } = useSceneStore()

  const scenesList = useMemo(() => {
    const list: IScene[] = []
    story.sceneIds?.forEach(id => {
      const item = getSceneById(id)
      if (item) {
        list.push(item)
      }
    })
    return list
  }, [getSceneById, story.sceneIds])

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

      {!scenesList.length ? (
        <div className={styles.content}>
          {!formattedResponse ? (
            <StoryForm story={story} onGenerate={handleStoryGenerate} />
          ) : (
            <StoryResponse
              response={formattedResponse}
              onCancel={onStoryCancel}
              onGenerate={onScenesGenerate}
            />
          )}
        </div>
      ) : (
        <ScenesList list={scenesList} />
      )}

      {isStoryGenerating && <Spinner />}
    </article>
  )
}
