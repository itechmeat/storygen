import { FC, useCallback, useMemo } from 'react'
import { UnorderedListOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps } from 'antd'
import { AIImageModel, GPTModel } from '../../../api/gpt'
import { Heading } from '../../../components/Heading/Heading'
import { Spinner } from '../../../components/Spinner/Spinner'
import { ScenesList } from '../../scene/ScenesList/ScenesList'
import { useSceneStore } from '../../scene/sceneStore'
import { IScene } from '../../scene/type'
import { StoryCover } from '../StoryCover/StoryCover'
import { StoryForm } from '../StoryForm/StoryForm'
import { StoryMeta } from '../StoryMeta/StoryMeta'
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
  onMetaGenerate: (model: GPTModel, context: string) => void
  onCoverGenerate: (model: AIImageModel) => void
}

export const Story: FC<StoryProps> = ({
  story,
  isStoryGenerating,
  formattedResponse,
  onUpdate,
  onStoryGenerate,
  onStoryCancel,
  onScenesGenerate,
  onMetaGenerate,
  onCoverGenerate,
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

  const handleMetaGenerate = (model: GPTModel) => {
    const context = scenesList.map(scene => scene.summary).join('\n')
    if (context) {
      onMetaGenerate(model, context)
    }
  }

  const NameSelector = () => {
    if (!story.names?.length) return null

    const items: MenuProps['items'] = story.names.map((name, index) => ({
      key: index,
      label: <span onClick={() => handleTitleUpdate(name)}>{name}</span>,
    }))

    return (
      <Dropdown
        menu={{ items }}
        placement="bottomRight"
        trigger={['click']}
        arrow={{ pointAtCenter: true }}
      >
        <Button icon={<UnorderedListOutlined />} />
      </Dropdown>
    )
  }

  if (!story) return null

  return (
    <article className={styles.story}>
      <Heading
        isCentered
        title={story.title}
        onChange={handleTitleUpdate}
        actions={<NameSelector />}
      />

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
        <>
          {story.summary && <StoryCover story={story} onGenerate={onCoverGenerate} />}
          <StoryMeta story={story} onGenerate={handleMetaGenerate} />
          <ScenesList list={scenesList} />
        </>
      )}

      {isStoryGenerating && <Spinner />}
    </article>
  )
}
