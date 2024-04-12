import { FC, useEffect, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form, Select } from 'antd'
import { AIImageModel, AIImageModelList } from '../../../api/gpt'
import { Spinner } from '../../../components/Spinner/Spinner'
import { IStory } from '../type'
import styles from './StoryCover.module.scss'

type Props = {
  story: IStory
  onGenerate: (model: AIImageModel) => void
}

export const StoryCover: FC<Props> = ({ story, onGenerate }) => {
  const [isChanging, setIsChanging] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState<AIImageModel>(AIImageModel.AnalogDiffusion)

  useEffect(() => {
    if (story.cover) {
      setIsLoading(false)
    }
  }, [story.cover])

  const handleSubmit = () => {
    setIsLoading(true)
    setIsChanging(false)
    onGenerate(model)
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

                {isLoading && <Spinner />}
              </Form>
            </div>
          ) : (
            <Button onClick={() => setIsStarted(true)}>Generate Cover</Button>
          )}
        </div>
      )}
    </div>
  )
}
