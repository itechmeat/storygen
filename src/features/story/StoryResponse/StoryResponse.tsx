import { FC, useMemo } from 'react'
import { Button } from 'antd'
import styles from './StoryResponse.module.scss'

type Props = {
  response: string
  onCancel: () => void
  onGenerate: () => void
}

export const StoryResponse: FC<Props> = ({ response, onCancel, onGenerate }) => {
  const formattedResponse = useMemo(() => {
    return response
      .split('<c>')
      .slice(1)
      .map(scene => {
        let title, description
        const titleMatch = scene.match(/<t>(.*?)<\/t>/)
        const descriptionMatch = scene.match(/<d>(.*?)<\/d>/)

        if (titleMatch && descriptionMatch) {
          title = titleMatch[1]
          description = descriptionMatch[1]
        } else {
          title = 'Untitled Chapter'
          description = scene.split('</c><d>')[1]?.split('</d>')[0] || 'No description provided' // Attempt to extract description
        }

        return { title, description }
      })
  }, [response])

  return (
    <div className={styles.response}>
      <h2 className={styles.h2}>Generated scenes for your story</h2>

      <ul className={styles.list}>
        {formattedResponse?.map((scene, index) => (
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
