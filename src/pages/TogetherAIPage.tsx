import { useCallback, useState } from 'react'
import { FileSearchOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Form, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import ReactMarkdown from 'react-markdown'
import { GPTModel, GPTModelList, Language, askGPT } from '../api/gpt'
import { Heading } from '../components/Heading/Heading'
import { Spinner } from '../components/Spinner/Spinner'

export const TogetherAIPage = () => {
  const [systemMessage, setSystemMessage] = useState(
    "You're skilled BackEnd developer. Give an answer in the markdown mode.",
  )
  const [prompt, setPrompt] = useState('What do you need to do to become a FrontEnd developer?')
  const [lang, setLang] = useState<Language>(Language.English)
  const [model, setModel] = useState<GPTModel>(GPTModel.Mistral8x7BInstruct)
  const [isLoading, setIsLoading] = useState(false)
  const [answer, setAnswer] = useState('')

  const fetchAIResponse = useCallback(
    async (inputText: string) => {
      return await askGPT({
        systemMessage: systemMessage,
        prompt: inputText,
        lang: lang,
        model: model,
      })
    },
    [lang, model, systemMessage],
  )

  const handleSubmit = useCallback(async () => {
    if (!prompt) return
    setIsLoading(true)

    const chatGPTResponse = await fetchAIResponse(prompt)
    if (chatGPTResponse) {
      setAnswer(chatGPTResponse)
    }
    setIsLoading(false)
  }, [fetchAIResponse, prompt])

  return (
    <>
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
          langValue: lang,
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

        <Form.Item label="Response language" name="langValue">
          <Select
            style={{ width: 300 }}
            options={[
              { value: Language.English, label: 'English' },
              { value: Language.Russian, label: 'Русский' },
            ]}
            onChange={val => setLang(val)}
          />
        </Form.Item>

        <Form.Item label="Model" name="modelValue">
          <Select
            style={{ width: 300 }}
            options={Array.from(GPTModelList, ([value, label]) => ({ value, label }))}
            onChange={val => setModel(val)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
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
    </>
  )
}
