import { FC, PropsWithChildren } from 'react'
import cn from 'classnames'
import styles from './Container.module.scss'

type Props = {
  className?: string
}
export const Container: FC<PropsWithChildren<Props>> = ({ children, className }) => {
  return <div className={cn(styles.container, className)}>{children}</div>
}
