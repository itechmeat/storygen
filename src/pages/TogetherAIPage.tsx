import { useCallback, useState } from 'react'
import { FileSearchOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Form, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { AITextModel, AITextModelList, askGPT } from '../api/gpt'
import { Heading } from '../components/Heading/Heading'
import { Spinner } from '../components/Spinner/Spinner'
import { Language } from '../features/localization/types'
import { UserKeysProvider } from '../features/user/UserKeysProvider/UserKeysProvider'
import { useCheckKeys } from '../features/user/hooks/check-keys.hook'

export const TogetherAIPage = () => {
  const { i18n } = useTranslation()
  const { getKey, requiredKey, setRequiredKey } = useCheckKeys()

  const [systemMessage, setSystemMessage] = useState(
    "You're skilled BackEnd developer. Give an answer in the markdown mode.",
  )
  const [prompt, setPrompt] = useState('What do you need to do to become a FrontEnd developer?')
  const [model, setModel] = useState<AITextModel>(AITextModel.Mistral8x7BInstruct)
  const [isLoading, setIsLoading] = useState(false)
  const [answer, setAnswer] = useState('')

  const fetchAIResponse = useCallback(
    async (inputText: string, localKey?: string) => {
      return await askGPT(
        {
          systemMessage: systemMessage,
          prompt: inputText,
          lang: i18n.language as Language,
          model,
        },
        localKey || getKey(model as AITextModel),
      )
    },
    [getKey, i18n, model, systemMessage],
  )

  const handleSubmit = useCallback(
    async (localKey?: string) => {
      if (!prompt) return

      const chatGPTResponse = await fetchAIResponse(prompt, localKey)
      if (chatGPTResponse) {
        setAnswer(chatGPTResponse)
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
        Together AI tests
      </Heading>

      <Form
        layout="vertical"
        initialValues={{
          systemMessageValue: systemMessage,
          promptValue: prompt,
          modelValue: model,
        }}
      >
        <Form.Item label="System message" name="systemMessageValue">
          <TextArea
            rows={2}
            value={systemMessage}
            onChange={e => setSystemMessage(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Prompt message" name="promptValue">
          <TextArea rows={2} value={prompt} onChange={e => setPrompt(e.target.value)} />
        </Form.Item>

        <Form.Item label="Model" name="modelValue">
          <Select
            style={{ width: 300 }}
            options={Array.from(AITextModelList, ([value, label]) => ({ value, label }))}
            onChange={val => setModel(val)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={() => handleSubmit()}>
            Ask TogetherAI
          </Button>
        </Form.Item>

        {isLoading && <Spinner />}
      </Form>

      {answer && (
        <>
          <h2>Answer</h2>
          <ReactMarkdown>{answer}</ReactMarkdown>
        </>
      )}
    </UserKeysProvider>
  )
}
