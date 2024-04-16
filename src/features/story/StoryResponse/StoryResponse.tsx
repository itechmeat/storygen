import { FC } from 'react'
import { Button, Result } from 'antd'
import { CompactShortScene } from '../type'
import styles from './StoryResponse.module.scss'

type Props = {
  response: CompactShortScene[]
  onCancel: () => void
  onGenerate: () => void
}

export const StoryResponse: FC<Props> = ({ response, onCancel, onGenerate }) => {
  const isWrongFormat = !Array.isArray(response)

  return (
    <div className={styles.response}>
      <h2 className={styles.h2}>Generated scenes for your story</h2>

      {!isWrongFormat ? (
        <ul className={styles.list}>
          {response?.map((scene, index) => (
            <li key={index} className={styles.chapter}>
              <h3 className={styles.title}>{scene.t}</h3>
              <p className={styles.paragraph}>{scene.d}</p>
            </li>
          ))}
        </ul>
      ) : (
        <Result
          status="warning"
          title="Format of the answer is wrong"
          extra={
            <Button type="primary" onClick={onGenerate}>
              Try again
            </Button>
          }
        />
      )}

      <footer className={styles.footer}>
        <Button onClick={onCancel}>Regenerate with new prompt</Button>
        <Button type="primary" onClick={onGenerate}>
          Generate full story
        </Button>
      </footer>
    </div>
  )
}
