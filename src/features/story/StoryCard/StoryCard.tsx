import { FC } from 'react'
import { DeleteOutlined, FileImageOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'
import { NavLink } from 'react-router-dom'
import { UUID } from '../../../types/common'
import { IStory } from '../type'
import styles from './StoryCard.module.scss'

const { Meta } = Card

type Props = {
  story: IStory
  onDelete?: (id: UUID) => void
}

export const StoryCard: FC<Props> = ({ story, onDelete }) => {
  return (
    <Card
      className={styles.card}
      cover={
        <NavLink to={`/stories/${story.id}`} className={styles.cover}>
          {story.cover ? (
            <img alt="example" src={story.cover} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>
              <FileImageOutlined className={styles.placeholderIcon} />
              <br />
              No cover
            </div>
          )}
        </NavLink>
      }
      actions={[
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => (onDelete ? onDelete(story.id) : {})}
        />,
      ]}
      hoverable
    >
      <Meta
        title={
          <NavLink to={`/stories/${story.id}`} className={styles.title}>
            {story.title}
          </NavLink>
        }
        description={story.description}
      />
    </Card>
  )
}
