import { FC, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { AIImageModel, AIImageModelList } from '../../../api/gpt'
import { IStory } from '../type'
import styles from './StoryCover.module.scss'

type Props = {
  story: IStory
  isGenerating: boolean
  onGenerate: (model: AIImageModel) => void
}

export const StoryCover: FC<Props> = ({ story, isGenerating, onGenerate }) => {
  const { t } = useTranslation()
  const [isChanging, setIsChanging] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [model, setModel] = useState<AIImageModel>(AIImageModel.RealisticVision)

  const handleSubmit = () => {
    setIsChanging(false)
    onGenerate(model)
  }

  if (isGenerating) {
    return (
      <div className={styles.cover}>
        <Spin />
      </div>
    )
  }

  return (
    <div className={styles.cover}>
      {story.cover && !isChanging ? (
        <div className={styles.poster}>
          <img src={story.cover} alt="" className={styles.image} />
          <Button
            className={styles.clear}
            icon={<DeleteOutlined />}
            onClick={() => setIsChanging(true)}
          />
        </div>
      ) : (
        <div className={styles.generator}>
          {isStarted ? (
            <div>
              <Form
                layout="vertical"
                initialValues={{
                  promptValue: prompt,
                  modelValue: model,
                }}
              >
                <Form.Item name="modelValue">
                  <Select
                    style={{ width: 200 }}
                    options={Array.from(AIImageModelList, ([value, label]) => ({ value, label }))}
                    onChange={val => setModel(val)}
                  />
                </Form.Item>

                <Form.Item className={styles.actions}>
                  <div className={styles.actions}>
                    <Button onClick={() => setIsStarted(false)}>Cancel</Button>
                    <Button type="primary" onClick={handleSubmit}>
                      Generate
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          ) : (
            <Button onClick={() => setIsStarted(true)}>{t('StoryPage.generateCover')}</Button>
          )}
        </div>
      )}
    </div>
  )
}
