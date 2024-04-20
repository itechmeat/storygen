/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react'
import { Button, Result, notification } from 'antd'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { AIImageModel, AITextModel, Language, askGPT, askGPTImage } from '../api/gpt'
import { useSceneStore } from '../features/scene/sceneStore'
import { IScene } from '../features/scene/type'
import { Story } from '../features/story/Story/Story'
import { useFetchAllStories } from '../features/story/hooks/fetch-stories.hook'
import { useStoryStore } from '../features/story/storyStore'
import { IStory } from '../features/story/type'
import { UserKeysProvider } from '../features/user/UserKeysProvider/UserKeysProvider'
import { useCheckKeys } from '../features/user/hooks/check-keys.hook'
import { clog } from '../utils/common.utils'
import {
  buildScenePrompt,
  extractArrayFromString,
  extractObjectFromString,
  formatResponse,
  getAudience,
  getGenre,
  getStoryTask,
  getWriterStyle,
} from '../utils/story.utils'

const PROMPT_SIZE = 2000

export const StoryPage = () => {
  useFetchAllStories()
  const { updateStory } = useStoryStore()
  const { createScene } = useSceneStore()

  const storyId = useParams().storyId
  const { getStoryById } = useStoryStore()
  const story = getStoryById(storyId)

  const { getKey, requiredKey, setRequiredKey } = useCheckKeys()

  const [isStoryGenerating, setIsStoryGenerating] = useState(false)
  const [changedStory, setChangedStory] = useState<IStory | null>(null)

  const formattedResponse = story?.response ? formatResponse(story?.response) : null

  const [api, contextHolder] = notification.useNotification()

  const openErrorNotification = (message: string, description?: string) => {
    api.error({
      message,
      description,
    })
  }

  const handleUpdate = useCallback(
    (story: IStory) => {
      updateStory(story.id, story)
    },
    [updateStory],
  )

  const fetchAIResponse = async (updatedStory: IStory, localKey?: string) => {
    const writerStyle = getWriterStyle(updatedStory)
    const storyTask = getStoryTask(updatedStory)
    const storyGenre = getGenre(updatedStory)
    const storyAudience = getAudience(updatedStory)

    const defineConfig = () => {
      switch (updatedStory.lang) {
        case Language.Russian:
          return `
            ${writerStyle} ${storyTask} ${storyGenre} ${storyAudience}
            Пришли полный список эпизодов без сокращений и пропусков.
            Формат ответа сделай в одном едином JSON:
            [{"t": "_название_", "d": "_описание_"}, ... {"t": "_название_", "d": "_описание_"}]
            Название должно быть без префиксов, только название. Не нумеруй эпизоды.
            Размер каждого описания около ${(PROMPT_SIZE - 100) / (updatedStory?.scenesNum || 1)}
            В ответе не должно быть ничего, кроме этого JSON.
            `
        default:
          return `
            ${writerStyle} ${storyTask} ${storyGenre} ${storyAudience}
            In your response, provide only the list of episodes and nothing more. The response format should be an unordered list, with each item containing the episode title and description.
            Each episode is enclosed in a <c> tag, the title in a <t> tag (title only, without any prefix like "episode" or similar), and the description in a <d> tag.
            Make the response format in JSON:
            [{t: '_title_', d: '_description_'}]
            The name must have no prefixes, just the title. Don't number the episodes.
            The size of each description is about ${(PROMPT_SIZE - 100) / (updatedStory?.scenesNum || 1)}
            The response should contain nothing other than this JSON.
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

    try {
      const key = localKey || getKey(updatedStory.model as AITextModel)
      console.log('🚀 ~ fetchAIResponse ~ key:', key)
      return await askGPT(request, key)
    } catch (error) {
      console.error(error)
    }
  }

  const handleStoryGenerate = async (updatedStory: IStory) => {
    setChangedStory(updatedStory)
    setIsStoryGenerating(true)
    const chatGPTResponse = await fetchAIResponse(updatedStory)
    if (!chatGPTResponse && getKey(updatedStory.model as AITextModel)) {
      openErrorNotification('Wrong answer')
      setIsStoryGenerating(false)
      return
    }
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
            Не нумеруй эпизоды.
            `
        default:
          return `
            ${writerStyle} ${storyGenre} ${storyAudience}
            The answer should contain only the episode and nothing more.
            Don't number the episodes.
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

    return await askGPT(request, getKey(story.model as AITextModel))
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

    return await askGPT(request, getKey(story.model as AITextModel))
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
          title: formattedResponse[i].t,
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

  const handleMetaGenerate = async (model: AITextModel, context: string) => {
    if (!story) return

    setIsStoryGenerating(true)

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
      prompt: definePrompt(),
      lang: story.lang,
      model: model || story.model,
    }

    clog('Request', JSON.stringify(request))

    const response = await askGPT(request, getKey(story.model as AITextModel))

    setIsStoryGenerating(false)

    if (response) {
      const resJSON = extractObjectFromString(response)

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

    try {
      const response = await askGPTImage(options, getKey(model))
      const imageData = response?.[0]
      await updateStory(story.id, {
        cover: imageData?.b64_json
          ? `data:image/png;base64, ${imageData?.b64_json}`
          : imageData?.url,
      })
    } catch (error: any) {
      openErrorNotification("Can't generate Image", error.message)
    } finally {
      setIsStoryGenerating(false)
    }
  }

  const handleOk = (localKey: string) => {
    setRequiredKey(null)
    if (changedStory) {
      fetchAIResponse(changedStory, localKey)
    }
  }

  const handleCancel = () => {
    setRequiredKey(null)
    setIsStoryGenerating(false)
  }

  if (!story)
    return (
      <Result
        status="404"
        title="Story not found"
        subTitle="See your other stories"
        extra={
          <Button type="primary" href=".">
            Go to stories
          </Button>
        }
      />
    )

  return (
    <UserKeysProvider requiredKey={requiredKey} onOk={handleOk} onClose={handleCancel}>
      {contextHolder}
      <Story
        story={story}
        formattedResponse={extractArrayFromString(story.response)}
        isStoryGenerating={isStoryGenerating}
        onUpdate={handleUpdate}
        onStoryGenerate={handleStoryGenerate}
        onStoryCancel={() => handleUpdate({ ...story, response: '' })}
        onScenesGenerate={handleScenesGenerate}
        onMetaGenerate={handleMetaGenerate}
        onCoverGenerate={handleCoverGenerate}
      />
    </UserKeysProvider>
  )
}
