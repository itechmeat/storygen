import { useEffectOnce } from 'react-use'
import { useSceneStore } from '../../scene/sceneStore'
import { useStoryStore } from '../storyStore'

export const useFetchAllStories = () => {
  const { fetchAllStories } = useStoryStore()
  const { fetchAllScenes } = useSceneStore()

  useEffectOnce(() => {
    fetchAllStories()
    fetchAllScenes()
  })
}
