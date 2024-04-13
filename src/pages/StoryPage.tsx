import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { AIImageModel, GPTModel, Language, askGPT, askGPTImage } from '../api/gpt'
import { useSceneStore } from '../features/scene/sceneStore'
import { IScene } from '../features/scene/type'
import { Story } from '../features/story/Story/Story'
import { useFetchAllStories } from '../features/story/hooks/fetch-stories.hook'
import { useStoryStore } from '../features/story/storyStore'
import { IStory } from '../features/story/type'
import { clog } from '../utils/common.utils'
import {
  buildScenePrompt,
  formatResponse,
  getAudience,
  getGenre,
  getStoryTask,
  getWriterStyle,
} from '../utils/story.utils'

export const StoryPage = () => {
  useFetchAllStories()

  const { updateStory } = useStoryStore()
  const { createScene } = useSceneStore()

  const storyId = useParams().storyId
  const { getStoryById } = useStoryStore()
  const story = getStoryById(storyId)

  const [isStoryGenerating, setIsStoryGenerating] = useState(false)

  const formattedResponse = story?.response ? formatResponse(story?.response) : null

  const handleUpdate = useCallback(
    (story: IStory) => {
      updateStory(story.id, story)
    },
    [updateStory],
  )

  const fetchAIResponse = async (updatedStory: IStory) => {
    const writerStyle = getWriterStyle(updatedStory)
    const storyTask = getStoryTask(updatedStory)
    const storyGenre = getGenre(updatedStory)
    const storyAudience = getAudience(updatedStory)

    const defineConfig = () => {
      switch (updatedStory.lang) {
        case Language.Russian:
          return `
            ${writerStyle} ${storyTask} ${storyGenre} ${storyAudience}
            В ответе пришли только список эпизодов и ничего более. Фотмат ответа - ненумерованый список, в каждом пункте название эпизода и описание эпизода.
            Каждый эпизод заключен в тег <c>, название в теге <t> (только название, без префикса "эпизод" и подобного), описание в теге <d>.
            Т.е. структура конечного формата: <c><t>название</t><d>описание</d></c>.
            Пришли полный список без сокращений и пропусков.
            `
        default:
          return `
            ${writerStyle} ${storyTask} ${storyGenre} ${storyAudience}
            In your response, provide only the list of episodes and nothing more. The response format should be an unordered list, with each item containing the episode title and description.
            Each episode is enclosed in a <c> tag, the title in a <t> tag (title only, without any prefix like "episode" or similar), and the description in a <d> tag.
            Thus, the final format structure is: <c><t>title</t><d>description</d></c>.
            Send the complete list without abbreviations or omissions.
            `
      }
    }

    const request = {
      systemMessage: defineConfig(),
      prompt: updatedStory.prompt,
      lang: updatedStory.lang,
      model: updatedStory.model,
    }

    clog('Request', JSON.stringify(request))

    return await askGPT(request)
  }

  const handleStoryGenerate = async (updatedStory: IStory) => {
    setIsStoryGenerating(true)
    const chatGPTResponse = await fetchAIResponse(updatedStory)
    if (chatGPTResponse) {
      handleUpdate({ ...updatedStory, response: chatGPTResponse.trim() })
    }
    setIsStoryGenerating(false)
  }

  const generateSceneContent = async (story: IStory, context: string) => {
    const writerStyle = getWriterStyle(story)
    const storyGenre = getGenre(story)
    const storyAudience = getAudience(story)

    const defineConfig = () => {
      switch (story.lang) {
        case Language.Russian:
          return `
            ${writerStyle} ${storyGenre} ${storyAudience}
            В ответе должен содержаться только эпизод и ничего более.
            Не нужно вначале дописывать ничего вроде "Эпизод №...".
            `
        default:
          return `
            ${writerStyle} ${storyGenre} ${storyAudience}
            The answer should contain only the episode and nothing more.
            There is no need to first add anything like “Episode No...”
            `
      }
    }

    const definePrompt = () => {
      switch (story.lang) {
        case Language.Russian:
          return `
            Требуется написать отдельный эпизод истории. Вот краткое описание истории:
            ${context}
            `
        default:
          return `
            You need to write a separate episode of the story. Here's a brief summary of the story:
            ${context}
            `
      }
    }

    const request = {
      systemMessage: defineConfig(),
      prompt: definePrompt(),
      lang: story.lang,
      model: story.model,
    }

    clog('Request', JSON.stringify(request))

    return await askGPT(request)
  }

  const generateSceneSummary = async (story: IStory, context: string) => {
    const defineConfig = () => {
      switch (story.lang) {
        case Language.Russian:
          return `
            В ответе должно содержаться только саммари и ничего более.
            `
        default:
          return `
            The answer should contain only the summary and nothing more.
            `
      }
    }

    const definePrompt = () => {
      switch (story.lang) {
        case Language.Russian:
          return `
            У меня написан такой эпизод:
            ${context}
            Напиши саммари для него, от 300 до 500 символов.
            `
        default:
          return `
            I wrote this episode:
            ${context}
            Write a summary for him, from 300 to 500 characters.
            `
      }
    }

    const request = {
      systemMessage: defineConfig(),
      prompt: definePrompt(),
      lang: story.lang,
      model: story.model,
    }

    clog('Request', JSON.stringify(request))

    return await askGPT(request)
    // return 'NOPE'
  }

  const handleScenesGenerate = async () => {
    if (!story || !formattedResponse) return
    setIsStoryGenerating(true)

    const scenes: IScene[] = []

    for (let i = 0; i < formattedResponse.length; i++) {
      const context = buildScenePrompt(story, formattedResponse, i)
      const content = await generateSceneContent(story, context)
      if (content) {
        const summary = await generateSceneSummary(story, content)
        const scene: IScene = {
          id: uuidv4(),
          title: formattedResponse[i].title,
          content,
          summary: summary ? summary : undefined,
        }
        scenes.push(scene)
      }
    }

    setIsStoryGenerating(false)

    for (const scene of scenes) {
      await createScene(scene)
    }

    await updateStory(story.id, { ...story, sceneIds: scenes.map(item => item.id) })
  }

  const handleMetaGenerate = async (model: GPTModel, context: string) => {
    if (!story) return

    setIsStoryGenerating(true)

    const defineConfig = () => {
      switch (story.lang) {
        case Language.Russian:
          return `Отвечай на Русском языке`
        default:
          return `Answer in English`
      }
    }

    const definePrompt = () => {
      switch (story.lang) {
        case Language.Russian:
          return `
            У меня написана такая история:
            ---
            ${context}
            ---
            Напиши саммари для неё, от 300 до 500 символов.
            Это же саммари перевиди на английский язык.
            А так же на русском напиши короткое описание, от 100 до 120 символов.
            А так же на русском предложи 10 вариантов названия для истории.
            Формат ответа сделай в JSON:
            {summary: '_summary_', summary_en: '_summary_en_', description: '_description_', names: ['name1', 'name2', ... 'name10']}
            В ответе не должно быть ничего, кроме этого JSON.
            `
        default:
          return `
            I have this story written:
            ---
            ${context}
            ---
            Write a summary for her, from 300 to 500 characters.
            And also write a short description, from 100 to 120 characters.
            Also, suggest 10 options for a title for the story.
            Make the response format in JSON:
            {summary: '_summary_', summary_en: '_summary_', description: '_description_', names: ['name1', 'name2', ... 'name10']}
            The response should contain nothing other than this JSON.
          `
      }
    }

    const request = {
      systemMessage: defineConfig(),
      prompt: definePrompt(),
      lang: story.lang,
      model: model || story.model,
    }

    clog('Request', JSON.stringify(request))

    const response = await askGPT(request)

    setIsStoryGenerating(false)

    if (response) {
      const jsonStart = response.indexOf('{')
      const jsonEnd = response.lastIndexOf('}')
      const jsonString = response.substring(jsonStart, jsonEnd + 1)
      const resJSON = JSON.parse(jsonString)

      const update = {
        ...story,
        names: resJSON?.names || [],
        description: resJSON?.description || '',
        summary: resJSON?.summary || '',
        summary_en: resJSON?.summary_en || '',
      }

      await updateStory(story.id, update)
    }
    return response
  }

  const handleCoverGenerate = async (model: AIImageModel) => {
    if (!story?.summary) return

    setIsStoryGenerating(true)

    await updateStory(story.id, {
      cover: '',
    })

    const definePrompt = () => {
      switch (story.lang) {
        case Language.Russian:
          return `
            У меня написана такая история:
            ---
            ${story.summary_en}
            ---
            Мне нужно придумать для этой истории.
            Сгенерируй эту обложку, пропорции картинки - квадрат.
            Название истории - ${story.title}, напиши это название вверху.
            Так же внизу напиши короткий слоган - ${story.description}
          `
        default:
          return `
            I have this story written:
            ---
            ${story.summary_en}
            ---
            I need to come up with an idea for this story.
            Generate this cover, the proportions of the image are square.
            The title of the story is ${story.title}, write this title at the top.
            Also write a short slogan below - ${story.description}
          `
      }
    }

    const isOpenAiExtended = model === AIImageModel.OpenAIDallE3
    const baseOptions = {
      model: model,
      prompt: definePrompt(),
      n: 1,
    }
    const openAiOptions = {
      size: '1024x1024',
      quality: 'standard',
    }
    const options = isOpenAiExtended ? { ...baseOptions, ...openAiOptions } : baseOptions
    const response = await askGPTImage(options)
    const imageData = response?.[0]
    await updateStory(story.id, {
      cover: imageData?.b64_json ? `data:image/png;base64, ${imageData?.b64_json}` : imageData?.url,
    })

    setIsStoryGenerating(false)
  }

  if (!story) return <div>Story not found</div>

  return (
    <Story
      story={story}
      formattedResponse={formattedResponse}
      isStoryGenerating={isStoryGenerating}
      onUpdate={handleUpdate}
      onStoryGenerate={handleStoryGenerate}
      onStoryCancel={() => handleUpdate({ ...story, response: '' })}
      onScenesGenerate={handleScenesGenerate}
      onMetaGenerate={handleMetaGenerate}
      onCoverGenerate={handleCoverGenerate}
    />
  )
}
