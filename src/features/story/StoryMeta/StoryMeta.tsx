import { FC, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { AITextModel, AITextModelList } from '../../../api/gpt'
import { useStoryStore } from '../storyStore'
import { IStory } from '../type'
import styles from './StoryMeta.module.scss'

type Props = {
  story: IStory
  isGenerating: boolean
  onGenerate: (model: AITextModel) => void
}

export const StoryMeta: FC<Props> = ({ story, isGenerating, onGenerate }) => {
  const { t } = useTranslation()
  const { updateStory } = useStoryStore()

  const [model, setModel] = useState<AITextModel>(story.model || AITextModel.Mistral8x7BInstruct)

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
      {story.summary ? (
        <div className={styles.poster}>
          {story.description && <h3 className={styles.description}>{story.description}</h3>}
          <p>
            <q className={styles.quote}>{story.summary}</q>
          </p>
        </div>
      ) : isGenerating ? (
        <h1 className={styles.genTitle}>
          {t('StoryPage.generatingMetaData')} <Spin />
        </h1>
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
              <Button type="primary" onClick={() => onGenerate(model)}>
                {t('StoryPage.generateMetaData')}
              </Button>
            </Form.Item>

            <span>{t('StoryPage.generateWith')}</span>

            <Form.Item name="modelValue" className={styles.field}>
              <Select
                style={{ width: 300 }}
                options={Array.from(AITextModelList, ([value, label]) => ({ value, label }))}
                onChange={val => setModel(val)}
              />
            </Form.Item>
          </Form>
        </div>
      )}

      {!false && story.summary && (
        <div className={styles.actions}>
          <Button danger icon={<DeleteOutlined />} onClick={tmpClear}>
            {t('StoryPage.removeMetaData')}
          </Button>
        </div>
      )}
    </div>
  )
}
