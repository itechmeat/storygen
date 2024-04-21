import { FC } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSceneStore } from '../../scene/sceneStore'
import { useStoryStore } from '../storyStore'
import { IStory } from '../type'

type Props = {
  story: IStory
}

export const StoryScenesActions: FC<Props> = ({ story }) => {
  const { t } = useTranslation()
  const { updateStory } = useStoryStore()
  const { deleteScene } = useSceneStore()

  const removeScenes = async () => {
    const ids = story.sceneIds || []
    ids.forEach(id => {
      deleteScene(id)
    })

    const update = {
      ...story,
      sceneIds: [],
    }

    await updateStory(story.id, update)
  }

  return (
    <Button danger icon={<DeleteOutlined />} onClick={removeScenes}>
      {t('StoryPage.removeScenes')}
    </Button>
  )
}
