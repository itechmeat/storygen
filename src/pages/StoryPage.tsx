/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react'
import { Button, Result, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { AIImageModel, AITextModel, askGPT, askGPTImage } from '../api/gpt'
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
  getAudienceText,
  getGenreText,
  getNewStoryTaskText,
  getWriterStyleText,
} from '../utils/story.utils'

const PROMPT_SIZE = 2000

export const StoryPage = () => {
  const { t } = useTranslation()

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
    const systemMessageSize = 650

    const systemMessage = [
      getWriterStyleText(updatedStory, t),
      getNewStoryTaskText(updatedStory, t),
      getGenreText(updatedStory, t),
      getAudienceText(updatedStory, t),
      t('prompts.storyGenerator.main', {
        num: updatedStory.scenesNum,
        size: Math.round((PROMPT_SIZE - systemMessageSize) / (updatedStory?.scenesNum || 1)),
      }),
    ]
      .filter(Boolean)
      .join('\n')

    const request = {
      systemMessage,
      prompt: updatedStory.prompt,
      lang: updatedStory.lang,
      model: updatedStory.model,
    }

    clog('Request', JSON.stringify(request))

    try {
      const key = localKey || getKey(updatedStory.model as AITextModel)
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

  const generateSceneContent = async (updatedStory: IStory, context: string) => {
    const systemMessageSize = 300

    const systemMessage = [
      getWriterStyleText(updatedStory, t),
      getGenreText(updatedStory, t),
      getAudienceText(updatedStory, t),
      t('prompts.sceneGenerator', {
        size: systemMessageSize,
      }),
    ]
      .filter(Boolean)
      .join('\n')

    const request = {
      systemMessage,
      prompt: t('prompts.scenePrompt', { context }),
      lang: updatedStory.lang,
      model: updatedStory.model,
    }

    clog('Request', JSON.stringify(request))

    return await askGPT(request, getKey(updatedStory.model as AITextModel))
  }

  const generateSceneSummary = async (story: IStory, context: string) => {
    const request = {
      systemMessage: t('prompts.sceneSummaryGenerator'),
      prompt: context,
      lang: story.lang,
      model: story.model,
    }

    clog('Request', JSON.stringify(request))

    return await askGPT(request, getKey(story.model as AITextModel))
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

    const request = {
      prompt: t('prompts.storySummaryGenerator', { context }),
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
        names: resJSON?.storyTitles || [],
        description: resJSON?.description || '',
        summary: resJSON?.summary || '',
        summary_en: resJSON?.summaryEn || resJSON?.summary || '',
        cover_text: resJSON?.coverText || '',
        cover_text_en: resJSON?.coverTextEn || resJSON?.coverText || '',
      }

      await updateStory(story.id, update)
    }
    return response
  }

  const handleCoverGenerate = async (model: AIImageModel) => {
    if (!story?.cover_text_en) return

    setIsStoryGenerating(true)

    await updateStory(story.id, {
      cover: '',
    })

    const isOpenAiExtended = model === AIImageModel.OpenAIDallE3
    const baseOptions = {
      model: model,
      prompt: story.cover_text_en,
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
        title={t('notFound.story.title')}
        subTitle={t('notFound.story.subTitle')}
        extra={
          <Button type="primary" href=".">
            {t('notFound.story.cta')}
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
