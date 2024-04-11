import { Language } from '../api/gpt'
import { IStory } from '../features/story/type'

export const getWriterStyle = (story: IStory) => {
  switch (story.lang) {
    case Language.Russian:
      return !story.writer
        ? 'Ты - современный писатель.'
        : `Ты - писатель, который пишет книги в стиле автора ${story.writer}.`
    default:
      return !story.writer
        ? 'You are modern writer.'
        : `You are a writer in the style of author ${story.writer}.`
  }
}

export const getGenre = (story: IStory) => {
  switch (story.lang) {
    case Language.Russian:
      return !story.genre
        ? 'Выбери наиболее подходящий жанр на основе промпта.'
        : `Пиши историю в жанре ${story.genre}.`
    default:
      return !story.genre
        ? 'Choose the most suitable genre based on the prompt.'
        : `Write a story in the ${story.genre} genre.`
  }
}

export const getAudience = (story: IStory) => {
  switch (story.lang) {
    case Language.Russian:
      return !story.audience
        ? 'Выбери наиболее подходящую аудиторию на основе промпта.'
        : `Пиши историю для аудитории ${story.audience}.`
    default:
      return !story.genre
        ? 'Choose the most suitable audience based on the prompt.'
        : `Write a story for the ${story.audience} audience.`
  }
}

export const getStoryTask = (story: IStory, size = 30000) => {
  switch (story.lang) {
    case Language.Russian:
      return `Твоя задача - по описанию из промпта составить список из ${story.scenesNum} эпизодов, которые будут описывать историю. Размер каждого эпизода не менее ${size / Number(story.scenesNum)} символов.`
    default:
      return `Your task is to create a list of ${story.scenesNum} episodes based on the prompt's description that will narrate the story. The size of each episode is at least ${size / Number(story.scenesNum)} characters.`
  }
}
