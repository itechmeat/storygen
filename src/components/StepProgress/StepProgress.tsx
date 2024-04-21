import { FC } from 'react'
import cn from 'classnames'
import styles from './StepProgress.module.scss'

type Props = {
  current: number
  total: number
}

export const StepProgress: FC<Props> = ({ current, total }) => {
  return (
    <div className={styles.progress}>
      {[...Array(total)].map((_, index) => (
        <div key={index} className={cn(styles.step, { [styles.current]: index + 1 <= current })} />
      ))}
    </div>
  )
}
