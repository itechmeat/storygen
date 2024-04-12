import { FC } from 'react'
import { Button } from 'antd'
import { useStoryStore } from '../storyStore'
import { IStory } from '../type'
import styles from './StoryMeta.module.scss'

type Props = {
  story: IStory
  onGenerate: () => void
}

export const StoryMeta: FC<Props> = ({ story, onGenerate }) => {
  const { updateStory } = useStoryStore()

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
          <Button onClick={onGenerate}>Generate Meta Data</Button>
        </div>
      )}
    </div>
  )
}
