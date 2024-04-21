import { FC, useState } from 'react'
import { Button, Form, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { AITextModel, AITextModelList } from '../../../api/gpt'
import { IStory } from '../type'
import styles from './StoryMetaForm.module.scss'

type Props = {
  story: IStory
  isGenerating: boolean
  onGenerate: (model: AITextModel) => void
}

export const StoryMetaForm: FC<Props> = ({ story, isGenerating, onGenerate }) => {
  const { t } = useTranslation()

  const [model, setModel] = useState<AITextModel>(story.model || AITextModel.Mistral8x7BInstruct)

  return (
    <div className={styles.meta}>
      {isGenerating ? (
        <div className={styles.process}>
          {t('StoryPage.generatingMetaData')} <Spin />
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
    </div>
  )
}
