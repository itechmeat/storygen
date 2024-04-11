import { useEffectOnce } from 'react-use'
import { useStoryStore } from '../storyStore'

export const useFetchAllStories = () => {
  const { fetchAllStories } = useStoryStore()

  useEffectOnce(() => {
    fetchAllStories()
  })
}
