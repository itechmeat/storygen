import { Language, Translation } from '../features/localization/types'
import { CompactShortScene, IStory } from '../features/story/type'

export const getWriterStyleText = (story: IStory, t: Translation) => {
  return !story.writer
    ? t('prompts.writerVariant.unnamed')
    : t('prompts.writerVariant.named', {
        writer: t(`StoryPage.writers.${story.writer}`),
      })
}

export const getGenreText = (story: IStory, t: Translation) => {
  return !story.genre
    ? t('prompts.genreVariant.unnamed')
    : t('prompts.genreVariant.named', {
        genre: t(`StoryPage.genres.${story.genre}`),
      })
}

export const getAudienceText = (story: IStory, t: Translation) => {
  return story.audience
    ? t('prompts.audience', { audience: t(`StoryPage.audiences.${story.audience}`) })
    : null
}

export const getNewStoryTaskText = (story: IStory, t: Translation) => {
  return t('prompts.storyGenerator.task', { num: story.scenesNum })
}

export const buildScenePrompt = (
  story: IStory,
  response: CompactShortScene[],
  num: number,
): string => {
  const prefix = story.lang === Language.RU ? 'Эпизод' : 'Scene'
  const config =
    story.lang === Language.RU
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
