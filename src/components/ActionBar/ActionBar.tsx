import { FC, ReactNode } from 'react'
import styles from './ActionBar.module.scss'

type Props = {
  actionStart?: ReactNode
  actionEnd?: ReactNode
}

export const ActionBar: FC<Props> = ({ actionStart, actionEnd }) => {
  return (
    <div className={styles.actions}>
      <div className={styles.start}>{actionStart}</div>
      {actionEnd && <div className={styles.end}>{actionEnd}</div>}
    </div>
  )
}
