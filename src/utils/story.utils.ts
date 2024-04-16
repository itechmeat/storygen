import { Language } from '../api/gpt'
import { CompactShortScene, IStory } from '../features/story/type'

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
      return `Твоя задача - по описанию из промпта составить список из ${story.scenesNum} эпизодов, которые будут описывать историю.`
    default:
      return `Your task is to create a list of ${story.scenesNum} episodes based on the prompt's description that will narrate the story. The size of each episode is at least ${size / Number(story.scenesNum)} characters.`
  }
}

export const buildScenePrompt = (
  story: IStory,
  response: CompactShortScene[],
  num: number,
): string => {
  const prefix = story.lang === Language.Russian ? 'Эпизод' : 'Scene'
  const config =
    story.lang === Language.Russian
      ? `Максимально подробно напиши эпизод №${num + 1}`
      : `Write episode number ${num + 1} in as much detail as possible`
  const content = response
    .map((scene, index) => `${prefix} ${index + 1}: ${scene.t}\n${scene.d}\n\n`)
    .join('')
  return `${content}\n${config}`
}

export const extractArrayFromString = (text?: string) => {
  if (!text) return null

  if (typeof text === 'object') {
    return text
  }

  const WRONG_RESULT = 'Wrong result'
  const OBJECTS_LINE_PATTERN = '}{'
  const OBJECTS_N_PATTERN = '}\n{'
  const OBJECTS_FINAL_PATTERN = '},{'

  let isObjects = false

  let startIndex = text.indexOf('[')
  if (startIndex === -1) {
    startIndex = text.indexOf('{')
    if (startIndex !== -1 && !text.includes('"summary')) {
      isObjects = true
    }
  }
  if (startIndex === -1) {
    return WRONG_RESULT
  }

  let endIndex = text.indexOf(']', startIndex)
  if (endIndex === -1) {
    endIndex = text.lastIndexOf('}')
  }
  if (endIndex === -1) {
    return WRONG_RESULT
  }

  let jsonString = text.substring(startIndex, endIndex + 1)
  if (isObjects) {
    if (text.indexOf(OBJECTS_LINE_PATTERN) !== -1) {
      jsonString = jsonString.split(OBJECTS_LINE_PATTERN).join(OBJECTS_FINAL_PATTERN)
    }
    if (text.indexOf(OBJECTS_N_PATTERN) !== -1) {
      jsonString = `[${jsonString.split(OBJECTS_N_PATTERN).join(OBJECTS_FINAL_PATTERN)}]`
    }
  }

  try {
    return JSON.parse(jsonString)
  } catch (error) {
    return WRONG_RESULT
  }
}

export const extractObjectFromString = (text?: string) => {
  if (!text) return null

  if (typeof text === 'object') {
    return text
  }

  const WRONG_RESULT = 'Wrong result'

  const startIndex = text.indexOf('{')
  if (startIndex === -1) {
    return WRONG_RESULT
  }

  const endIndex = text.indexOf('}', startIndex)
  if (endIndex === -1) {
    return WRONG_RESULT
  }

  const jsonString = text.substring(startIndex, endIndex + 1)

  try {
    return JSON.parse(jsonString)
  } catch (error) {
    return WRONG_RESULT
  }
}

export const formatResponse = (response: string): CompactShortScene[] => {
  return extractArrayFromString(response)
  // return response
  //   .split('<c>')
  //   .slice(1)
  //   .map(scene => {
  //     let title, description
  //     const titleMatch = scene.match(/<t>(.*?)<\/t>/)
  //     const descriptionMatch = scene.match(/<d>(.*?)<\/d>/)

  //     if (titleMatch && descriptionMatch) {
  //       title = titleMatch[1]
  //       description = descriptionMatch[1]
  //     } else {
  //       title = 'Untitled Chapter'
  //       description = scene.split('</c><d>')[1]?.split('</d>')[0] || 'No description provided' // Attempt to extract description
  //     }

  //     return { title, description }
  //   })
}
