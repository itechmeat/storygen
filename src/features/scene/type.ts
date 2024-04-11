import { UUID } from '../../types/common'

export type SceneContent = {
  content: string
  summary?: string
}

export type IScene = SceneContent & {
  id: UUID
  title: string
}
