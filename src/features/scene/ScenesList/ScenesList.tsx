import { FC } from 'react'
import { IScene } from '../type'
import styles from './ScenesList.module.scss'

type Props = {
  list: IScene[]
}

export const ScenesList: FC<Props> = ({ list }) => {
  return (
    <>
      {list?.map((scene, index) => (
        <section key={index} className={styles.scene}>
          <h3 className={styles.title}>{scene.title}</h3>
          <p className={styles.paragraph}>{scene.content}</p>
        </section>
      ))}
    </>
  )
}
