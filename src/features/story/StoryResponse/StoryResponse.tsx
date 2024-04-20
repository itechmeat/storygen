import { FC } from 'react'
import { Button } from 'antd'
import { ShortScene } from '../type'
import styles from './StoryResponse.module.scss'

type Props = {
  response: ShortScene[]
  onCancel: () => void
  onGenerate: () => void
}

export const StoryResponse: FC<Props> = ({ response, onCancel, onGenerate }) => {
  return (
    <div className={styles.response}>
      <h2 className={styles.h2}>Generated scenes for your story</h2>

      <ul className={styles.list}>
        {response?.map((scene, index) => (
          <li key={index} className={styles.chapter}>
            <h3 className={styles.title}>{scene.title}</h3>
            <p className={styles.paragraph}>{scene.description}</p>
          </li>
        ))}
      </ul>

      <footer className={styles.footer}>
        <Button onClick={onCancel}>Regenerate with new prompt</Button>
        <Button type="primary" onClick={onGenerate}>
          Generate full story
        </Button>
      </footer>
    </div>
  )
}
