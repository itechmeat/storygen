import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Language, askGPT } from '../api/gpt'
import { Story } from '../features/story/Story/Story'
import { useFetchAllStories } from '../features/story/hooks/fetch-stories.hook'
import { useStoryStore } from '../features/story/storyStore'
import { IStory } from '../features/story/type'
import { clog } from '../utils/common.utils'
import { getAudience, getGenre, getStoryTask, getWriterStyle } from '../utils/story.utils'

export const StoryPage = () => {
  useFetchAllStories()

  const { updateStory } = useStoryStore()

  const storyId = useParams().storyId
  const { getStoryById } = useStoryStore()
  const story = getStoryById(storyId)

  const [isStoryGenerating, setIsStoryGenerating] = useState(false)

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
    // return 'NOPE'
  }

  const handleStoryGenerate = async (updatedStory: IStory) => {
    setIsStoryGenerating(true)
    const chatGPTResponse = await fetchAIResponse(updatedStory)
    if (chatGPTResponse) {
      handleUpdate({ ...updatedStory, response: chatGPTResponse })
    }
    setIsStoryGenerating(false)
  }

  const handleScenesGenerate = async () => {
    console.log("🤖 Wi'll generate it later 🙂")
  }

  if (!story) return <div>Story not found</div>

  return (
    <Story
      story={story}
      isStoryGenerating={isStoryGenerating}
      onUpdate={handleUpdate}
      onStoryGenerate={handleStoryGenerate}
      onStoryCancel={() => handleUpdate({ ...story, response: '' })}
      onScenesGenerate={handleScenesGenerate}
    />
  )
}
