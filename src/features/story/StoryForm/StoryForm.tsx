import { FC, useCallback, useState } from 'react'
import { Button, Form, InputNumber, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useTranslation } from 'react-i18next'
import { AITextModel, AITextModelList } from '../../../api/gpt'
import { IStory, StoryAudience, StoryGenre, StoryOptions, StoryWriter } from '../type'
import styles from './StoryForm.module.scss'

type Props = {
  story: IStory
  onGenerate: (options: StoryOptions) => void
}

export const StoryForm: FC<Props> = ({ story, onGenerate }) => {
  const { t } = useTranslation()

  const [prompt, setPrompt] = useState(story.prompt || '')
  const [model, setModel] = useState<AITextModel>(story.model || AITextModel.Mistral8x7BInstruct)
  const [scenesNum, setScenesNum] = useState<number>(story.scenesNum || 5)
  const [writer, setWriter] = useState<StoryWriter | string | undefined>(story.writer)
  const [genre, setGenre] = useState<StoryGenre | undefined>(story.genre)
  const [audience, setAudience] = useState<StoryAudience | undefined>(story.audience)

  const buildOptions = (list: string[], translationPrefix: string) => {
    return list.map(item => {
      return { value: item, label: t(`${translationPrefix}.${item}`) }
    })
  }

  const writerOptions = buildOptions(Object.values(StoryWriter), 'StoryPage.writers')
  const genreOptions = buildOptions(Object.values(StoryGenre), 'StoryPage.genres')
  const audienceOptions = buildOptions(Object.values(StoryAudience), 'StoryPage.audiences')

  const handleChangeScenes = (e: number | null) => {
    setScenesNum(e || 1)
  }

  const handleSubmit = useCallback(async () => {
    if (!prompt) return
    onGenerate({
      prompt,
      model,
      scenesNum,
      writer,
      genre,
      audience,
    })
  }, [audience, genre, model, onGenerate, prompt, scenesNum, writer])

  return (
    <div className={styles.storyForm}>
      <Form
        layout="vertical"
        initialValues={{
          promptValue: prompt,
          modelValue: model,
          scenesValue: scenesNum,
          writerValue: writer ? [writer] : [],
          genreValue: genre,
          audienceValue: audience,
        }}
      >
        <Form.Item label={t('StoryPage.prompt')} name="promptValue">
          <TextArea rows={5} value={prompt} onChange={e => setPrompt(e.target.value)} />
        </Form.Item>

        <Form.Item label={t('StoryPage.model')} name="modelValue">
          <Select
            style={{ width: 300 }}
            options={Array.from(AITextModelList, ([value, label]) => ({ value, label }))}
            onChange={val => setModel(val)}
          />
        </Form.Item>

        <Form.Item label={t('StoryPage.writerStyle')} name="writerValue">
          <Select
            mode="tags"
            style={{ width: 300 }}
            placeholder={t('StoryPage.ownStyle')}
            maxCount={1}
            options={writerOptions}
            onChange={val => setWriter(val[0])}
          />
        </Form.Item>

        <Form.Item label={t('StoryPage.genre')} name="genreValue">
          <Select options={genreOptions} style={{ width: 300 }} onChange={val => setGenre(val)} />
        </Form.Item>

        <Form.Item label={t('StoryPage.audience')} name="audienceValue">
          <Select
            options={audienceOptions}
            style={{ width: 300 }}
            onChange={val => setAudience(val)}
          />
        </Form.Item>

        <Form.Item label={t('StoryPage.numberOfScenes')} name="scenesValue">
          <InputNumber min={1} max={10} onChange={handleChangeScenes} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" disabled={!prompt} onClick={handleSubmit}>
            {t('StoryPage.generateScenes')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
