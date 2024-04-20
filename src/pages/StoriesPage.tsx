import { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import { Heading } from '../components/Heading/Heading'
import { useLanguage } from '../features/localization/hooks/language.hook'
import { StoriesList } from '../features/story/StoriesList/StoriesList'
import { StoryCreateModal } from '../features/story/StoryCreateModal/StoryCreateModal'
import { useFetchAllStories } from '../features/story/hooks/fetch-stories.hook'
import { useStoryStore } from '../features/story/storyStore'
import { UUID } from '../types/common'

export const StoriesPage = () => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()

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
      lang: currentLanguage,
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
              {t('StoryPage.createNewStory')}
            </Button>
          }
        >
          {t('StoryPage.yourStories')}
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
