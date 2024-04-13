import { FC, useState } from 'react'
import { Button, Form, Select } from 'antd'
import { GPTModel, GPTModelList } from '../../../api/gpt'
import { useStoryStore } from '../storyStore'
import { IStory } from '../type'
import styles from './StoryMeta.module.scss'

type Props = {
  story: IStory
  onGenerate: (model: GPTModel) => void
}

export const StoryMeta: FC<Props> = ({ story, onGenerate }) => {
  const { updateStory } = useStoryStore()

  const [model, setModel] = useState<GPTModel>(story.model || GPTModel.Mistral8x7BInstruct)

  const tmpClear = async () => {
    const update = {
      ...story,
      names: [],
      description: '',
      summary: '',
    }

    await updateStory(story.id, update)
  }

  return (
    <div className={styles.meta}>
      {false && (
        <Button type="primary" danger onClick={tmpClear}>
          Clear
        </Button>
      )}

      {story.summary ? (
        <div className={styles.poster}>
          {story.description && <h3 className={styles.description}>{story.description}</h3>}
          <p>
            <q className={styles.quote}>{story.summary}</q>
          </p>
        </div>
      ) : (
        <div className={styles.generator}>
          <Form
            className={styles.form}
            layout="vertical"
            initialValues={{
              promptValue: prompt,
              modelValue: model,
            }}
          >
            <Form.Item className={styles.field}>
              <Button onClick={() => onGenerate(model)}>Generate Meta Data</Button>
            </Form.Item>

            <span>with</span>

            <Form.Item name="modelValue" className={styles.field}>
              <Select
                style={{ width: 300 }}
                options={Array.from(GPTModelList, ([value, label]) => ({ value, label }))}
                onChange={val => setModel(val)}
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  )
}
