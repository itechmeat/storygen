import { FC, PropsWithChildren, ReactNode } from 'react'
import cn from 'classnames'
import styles from './Heading.module.scss'

type Props = {
  actions?: ReactNode
  className?: string
}
export const Heading: FC<PropsWithChildren<Props>> = ({ className, children, actions }) => {
  return (
    <header className={cn(styles.header, className)}>
      <h1 className={styles.h1}>{children}</h1>
      {actions}
    </header>
  )
}
