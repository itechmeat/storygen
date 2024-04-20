import { FC, useEffect, useState } from 'react'
import { Input, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { UUID } from '../../../types/common'
import { IStory } from '../type'

type Props = {
  isOpen: boolean
  newStoryId?: UUID
  onClose: () => void
  onSubmit: (value: string) => Promise<IStory | undefined>
}

export const StoryCreateModal: FC<Props> = ({ isOpen, onSubmit, onClose }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const [storyTitle, setStoryTitle] = useState(t('StoryPage.defaultTitle') as string)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    setStoryTitle(t('StoryPage.defaultTitle'))
  }, [i18n.language, t])

  const handleOk = async () => {
    setConfirmLoading(true)
    try {
      const story = await onSubmit(storyTitle)
      if (story) {
        navigate(`/stories/${story.id}`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <Modal
      title={t('notices.createStory')}
      open={isOpen}
      confirmLoading={confirmLoading}
      okButtonProps={{ disabled: !storyTitle }}
      okText={t('actions.ok')}
      cancelText={t('actions.cancel')}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Input
        value={storyTitle}
        onChange={val => setStoryTitle(val.target.value)}
        placeholder="Story name"
      />
    </Modal>
  )
}
