import { FC, useCallback, useState } from 'react'
import { Button, Form, InputNumber, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { GPTModel, GPTModelList, Language } from '../../../api/gpt'
import { IStory, StoryAudience, StoryGenre, StoryOptions, StoryWriter } from '../type'
import styles from './StoryForm.module.scss'

type Props = {
  story: IStory
  onGenerate: (options: StoryOptions) => void
}

export const StoryForm: FC<Props> = ({ story, onGenerate }) => {
  const [prompt, setPrompt] = useState(story.prompt || '')
  const [lang, setLang] = useState<Language>(story.lang || Language.Russian)
  const [model, setModel] = useState<GPTModel>(story.model || GPTModel.Mistral8x7BInstruct)
  const [scenesNum, setScenesNum] = useState<number>(story.scenesNum || 5)
  const [writer, setWriter] = useState<StoryWriter | string | undefined>(story.writer)
  const [genre, setGenre] = useState<StoryGenre | undefined>(story.genre)
  const [audience, setAudience] = useState<StoryAudience | undefined>(story.audience)

  const writers = Object.values(StoryWriter).map(item => ({ value: item, label: item }))
  const genres = Object.values(StoryGenre).map(item => ({ value: item, label: item }))
  const audiences = Object.values(StoryAudience).map(item => ({ value: item, label: item }))

  const handleChangeScenes = (e: number | null) => {
    setScenesNum(e || 1)
  }

  const handleSubmit = useCallback(async () => {
    if (!prompt) return
    onGenerate({
      prompt,
      model,
      lang,
      scenesNum,
      writer,
      genre,
      audience,
    })
  }, [audience, genre, lang, model, onGenerate, prompt, scenesNum, writer])

  return (
    <div className={styles.storyForm}>
      <Form
        layout="vertical"
        initialValues={{
          promptValue: prompt,
          langValue: lang,
          modelValue: model,
          scenesValue: scenesNum,
          writerValue: writer ? [writer] : [],
          genreValue: genre,
          audienceValue: audience,
        }}
      >
        <Form.Item label="Describe your story" name="promptValue">
          <TextArea rows={5} value={prompt} onChange={e => setPrompt(e.target.value)} />
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

        <Form.Item label="Your favorite writer" name="writerValue">
          <Select
            mode="tags"
            style={{ width: 300 }}
            placeholder="Your own style"
            maxCount={1}
            options={writers}
            onChange={val => setWriter(val[0])}
          />
        </Form.Item>

        <Form.Item label="Genre" name="genreValue">
          <Select options={genres} style={{ width: 300 }} onChange={val => setGenre(val)} />
        </Form.Item>

        <Form.Item label="Audience" name="audienceValue">
          <Select options={audiences} style={{ width: 300 }} onChange={val => setAudience(val)} />
        </Form.Item>

        <Form.Item label="Number of scenes" name="scenesValue">
          <InputNumber min={1} max={10} onChange={handleChangeScenes} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" disabled={!prompt} onClick={handleSubmit}>
            Generate scenes
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
