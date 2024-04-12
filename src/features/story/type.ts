import { GPTModel, Language } from '../../api/gpt'
import { UUID } from '../../types/common'

export enum StoryWriter {
  Murakami = 'Haruki Murakami',
  Orwell = 'George Orwell',
  Kafka = 'Franz Kafka',
  Nabokov = 'Vladimir Nabokov',
  King = 'Stephen King',
  LiuCixin = 'Liu Cixin',
}

export enum StoryGenre {
  Fantasy = 'Fantasy',
  ScienceFiction = 'Science Fiction',
  Mystery = 'Mystery',
  Thriller = 'Thriller',
  Romance = 'Romance',
  HistoricalFiction = 'Historical Fiction',
  YoungAdult = 'Young Adult',
  Horror = 'Horror',
  LiteraryFiction = 'Literary Fiction',
  Memoir = 'Memoir',
}

export enum StoryAudience {
  Children = 'Children',
  Teenagers = 'Teenagers',
  YoungAdults = 'Young Adults',
  Adults = 'Adults',
  MiddleGrade = 'Middle Grade',
}

export type StoryOptions = {
  systemMessage?: string
  prompt?: string
  model?: GPTModel
  lang?: Language
  scenesNum?: number
  writer?: StoryWriter | string
  genre?: StoryGenre
  audience?: StoryAudience
}

export type IStory = StoryOptions & {
  id: UUID
  title: string
  description: string
  summary: string
  summary_en: string
  sceneIds: UUID[]
  cover?: string
  response?: string
  names?: string[]
}

export type ShortScene = {
  title: string
  description: string
}
