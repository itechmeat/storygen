import { useCallback, useMemo, useState } from 'react'
import { FileSearchOutlined } from '@ant-design/icons'
import { Button, Form } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import axios from 'axios'
import FormData from 'form-data'
import { Heading } from '../components/Heading/Heading'
import { Spinner } from '../components/Spinner/Spinner'
import { clog } from '../utils/common.utils'

export const StabilityAIPage = () => {
  const [prompt, setPrompt] = useState('Lighthouse on a cliff overlooking the ocean')
  const [isLoading, setIsLoading] = useState(false)
  const [answer, setAnswer] = useState<string>()
  console.log('🚀 ~ StabilityAIPage ~ answer:', answer)

  const formData = useMemo(
    () => ({
      prompt: prompt,
      output_format: 'jpeg',
    }),
    [prompt],
  )

  const fetchAIResponse = useCallback(async () => {
    clog('System message')
    clog('PROMPT', prompt)

    try {
      setIsLoading(true)
      const response = await axios.postForm(
        `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
        axios.toFormData(formData, new FormData()),
        {
          validateStatus: undefined,
          responseType: 'arraybuffer',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STABILITY_API_KEY}`,
            Accept: 'image/*',
            Model: 'sd3-turbo',
          },
        },
      )

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'image/jpeg' })
        const imageUrl = URL.createObjectURL(blob)
        setAnswer(imageUrl)
      } else {
        throw new Error(`${response.status}: ${response.data.toString()}`)
      }
      return response
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [formData, prompt])

  return (
    <>
      <Heading
        actions={
          <>
            <Button
              href="https://platform.openai.com/docs/quickstart?context=node"
              target="_blank"
              icon={<FileSearchOutlined />}
            >
              Documentation
            </Button>
          </>
        }
      >
        Stability AI tests
      </Heading>

      <Form layout="vertical" initialValues={{ promptValue: prompt }}>
        <Form.Item label="Prompt message" name="promptValue">
          <TextArea rows={2} value={prompt} onChange={e => setPrompt(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={() => fetchAIResponse()}>
            Ask Stability AI
          </Button>
        </Form.Item>

        {isLoading && <Spinner />}
      </Form>

      {answer && (
        <>
          <h2>Answer</h2>
          <img src={answer} alt="" />
        </>
      )}
    </>
  )
}
