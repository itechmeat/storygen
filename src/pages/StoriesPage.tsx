import { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { Heading } from '../components/Heading/Heading'
import { StoriesList } from '../features/story/StoriesList/StoriesList'
import { StoryCreateModal } from '../features/story/StoryCreateModal/StoryCreateModal'
import { useFetchAllStories } from '../features/story/hooks/fetch-stories.hook'
import { useStoryStore } from '../features/story/storyStore'
import { UUID } from '../types/common'

import { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { Heading } from '../components/Heading/Heading'
import { StoriesList } from '../features/story/StoriesList/StoriesList'
import { StoryCreateModal } from '../features/story/StoryCreateModal/StoryCreateModal'
import { useFetchAllStories } from '../features/story/hooks/fetch-stories.hook'
import { useStoryStore } from '../features/story/storyStore'
import { UUID } from '../types/common'

export const StoriesPage = () => {
  useFetchAllStories()
  const { createStory, getAllStories, deleteStory } = useStoryStore()

  const storiesList = getAllStories()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateStory = async (title: string) => {
    return await createStory({
      id: uuidv4(),
      title,
      description: '',
      prompt: '',
      summary: '',
      summary_en: '',
      sceneIds: [],
    })
  }

  const handleStoryDelete = async (id: UUID) => {
    await deleteStory(id)
  }

  useFetchAllStories()
  const { createStory, getAllStories, deleteStory } = useStoryStore()

  const storiesList = getAllStories()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateStory = async (title: string) => {
    return await createStory({
      id: uuidv4(),
      title,
      description: '',
      prompt: '',
      summary: '',
      summary_en: '',
      sceneIds: [],
    })
  }

  const handleStoryDelete = async (id: UUID) => {
    await deleteStory(id)
  }

  return (
    <>
      {storiesList?.length > 0 && (
        <Heading
          actions={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create new story
            </Button>
          }
        >
          Your Stories
        </Heading>
      )}

      <StoriesList
        list={storiesList}
        onStart={() => setIsCreateModalOpen(true)}
        onStoryDelete={id => handleStoryDelete(id)}
      />

      <StoryCreateModal
        isOpen={isCreateModalOpen}
        onSubmit={handleCreateStory}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  )
}
