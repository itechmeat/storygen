import { useParams } from 'react-router-dom'
import { StoryForm } from '../features/story/StoryForm/StoryForm'
import { useFetchAllStories } from '../features/story/hooks/fetch-stories.hook'
import { useStoryStore } from '../features/story/storyStore'

export const StoryPage = () => {
  useFetchAllStories()

  const storyId = useParams().storyId
  const { getStoryById } = useStoryStore()
  const story = getStoryById(storyId)

  if (!story) return <div>Story not found</div>

  return (
    <div>
      <StoryForm story={story} />
    </div>
  )
}
