import { FC, useState } from 'react'
import { Input, Modal } from 'antd'
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
  const navigate = useNavigate()

  const [storyTitle, setStoryTitle] = useState('New Story')
  const [confirmLoading, setConfirmLoading] = useState(false)

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
      title="Create your new story"
      open={isOpen}
      confirmLoading={confirmLoading}
      okButtonProps={{ disabled: !storyTitle }}
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
