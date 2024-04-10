import { useCallback, useState } from 'react'
import { Button, Form } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import OpenAI from 'openai'
import ReactMarkdown from 'react-markdown'
import { Spinner } from '../components/Spinner/Spinner'
import { clog } from '../utils/common.utils'

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export const OpenAIPage = () => {
  const [systemMessage, setSystemMessage] = useState("You're skilled frontend developer")
  const [prompt, setPrompt] = useState('What is the SOLID, DRY and KISS?')
  const [isLoading, setIsLoading] = useState(false)
  const [answer, setAnswer] = useState('')

  const askGPT = useCallback(async () => {
    clog('System message', systemMessage)
    clog('PROMPT', prompt)

    try {
      setIsLoading(true)
      const response = await client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'gpt-3.5-turbo',
      })

      const result = response.choices[0].message.content

      clog('ANSWER', result)

      if (result) {
        setAnswer(result)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [prompt, systemMessage])

  return (
    <div style={{ position: 'relative', paddingBlock: '20px' }}>
      <h1>Open AI tests</h1>

      <Form
        layout="vertical"
        initialValues={{ systemMessageValue: systemMessage, promptValue: prompt }}
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

        <Form.Item>
          <Button type="primary" onClick={askGPT}>
            Ask ChatGPT
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
    </div>
  )
}
