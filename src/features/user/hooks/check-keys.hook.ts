import { useState } from 'react'
import { AIImageModel, AITextModel } from '../../../api/gpt'
import { UserKeysNames } from '../types'
import { useUserStore } from '../userStore'

export const useCheckKeys = () => {
  const keyOpenAIapi = useUserStore(state => state.keyOpenAIapi)
  const keyTogetherAIapi = useUserStore(state => state.keyTogetherAIapi)

  const [requiredKey, setRequiredKey] = useState<UserKeysNames | null>(null)

  const getKey = (model: AITextModel | AIImageModel) => {
    const isOpenAI = model?.startsWith('gpt') || model?.startsWith('dall-e')
    const key = isOpenAI ? keyOpenAIapi : keyTogetherAIapi
    const keyName = isOpenAI ? 'keyOpenAIapi' : 'keyTogetherAIapi'

    if (!key) {
      setRequiredKey(keyName as UserKeysNames)
      throw new Error(`Key required: ${keyName}`)
    }

    return key
  }

  return { getKey, requiredKey, setRequiredKey }
}
