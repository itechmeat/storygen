import { UUID } from '../../types/common'

export type IStory = {
  id: UUID
  title: string
  description: string
  prompt: string
  summary: string
  sceneIds: UUID[]
  cover?: string
}
