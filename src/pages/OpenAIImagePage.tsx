import { useCallback, useMemo, useState } from 'react'
import { FileSearchOutlined, RetweetOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Form, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { AIImageModel, AIImageModelList, askGPTImage } from '../api/gpt'
import { Heading } from '../components/Heading/Heading'
import { Spinner } from '../components/Spinner/Spinner'
import { UserKeysProvider } from '../features/user/UserKeysProvider/UserKeysProvider'
import { useCheckKeys } from '../features/user/hooks/check-keys.hook'

type ImageData = {
  url?: string
  b64_json?: string
}

export const OpenAIImagePage = () => {
  const [prompt, setPrompt] = useState('Red Mazda CX5 in the post apocalypse')
  const [model, setModel] = useState<AIImageModel>(AIImageModel.AnalogDiffusion)
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState<ImageData | null>(null)

  const { getKey, requiredKey, setRequiredKey } = useCheckKeys()

  const imageSrc = useMemo(() => {
    if (!image) return
    return image.b64_json ? `data:image/png;base64, ${image.b64_json}` : image.url
  }, [image])

  const fetchAIResponse = useCallback(
    async (inputText: string, localKey?: string) => {
      const isOpenAiExtended = model === AIImageModel.OpenAIDallE3
      const baseOptions = {
        model: model,
        prompt: inputText,
        n: 1,
      }
      const openAiOptions = {
        size: '1024x1024',
        quality: 'standard',
      }
      const options = isOpenAiExtended ? { ...baseOptions, ...openAiOptions } : baseOptions
      return await askGPTImage(options, localKey || getKey(model))
    },
    [getKey, model],
  )

  const handleSubmit = useCallback(
    async (localKey?: string) => {
      if (!prompt) return
      setIsLoading(true)

      const chatGPTResponse = await fetchAIResponse(prompt, localKey)
      const imageData = chatGPTResponse?.[0]
      if (imageData) {
        setImage(imageData)
      }
      setIsLoading(false)
    },
    [fetchAIResponse, prompt],
  )

  const handleOk = (localKey: string) => {
    setRequiredKey(null)
    if (prompt) {
      handleSubmit(localKey)
    }
  }

  const handleCancel = () => {
    setRequiredKey(null)
    setIsLoading(false)
  }

  if (imageSrc) {
    return (
      <>
        <Heading
          actions={
            <div>
              <Button type="primary" icon={<RetweetOutlined />} onClick={() => setImage(null)}>
                Regenerate
              </Button>
            </div>
          }
        >
          Your image
        </Heading>
        <p>
          <img src={imageSrc} alt="" />
        </p>
        <br />
      </>
    )
  }

  return (
    <UserKeysProvider requiredKey={requiredKey} onOk={handleOk} onClose={handleCancel}>
      <Heading
        actions={
          <div>
            <Button
              href="https://docs.together.ai/docs/inference-models"
              target="_blank"
              icon={<UnorderedListOutlined />}
            >
              60+ models
            </Button>
            <span> </span>
            <Button
              href="https://docs.together.ai/docs/quickstart"
              target="_blank"
              icon={<FileSearchOutlined />}
            >
              Documentation
            </Button>
          </div>
        }
      >
        Generate new Image
      </Heading>

      <Form
        layout="vertical"
        initialValues={{
          promptValue: prompt,
          modelValue: model,
        }}
      >
        <Form.Item label="Prompt message" name="promptValue">
          <TextArea rows={2} value={prompt} onChange={e => setPrompt(e.target.value)} />
        </Form.Item>

        <Form.Item label="Model" name="modelValue">
          <Select
            style={{ width: 300 }}
            options={Array.from(AIImageModelList, ([value, label]) => ({ value, label }))}
            onChange={val => setModel(val)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={() => handleSubmit()}>
            Generate
          </Button>
        </Form.Item>

        {isLoading && <Spinner />}
      </Form>
    </UserKeysProvider>
  )
}
