import { FC, PropsWithChildren, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { Container } from '../../../components/Container/Container'
import styles from './Headline.module.scss'

type Props = {
  navSlot?: ReactNode
  userSlot?: ReactNode
}

export const Headline: FC<PropsWithChildren<Props>> = ({ navSlot, children }) => {
  return (
    <header className={styles.header}>
      <Container className={styles.wrapper}>
        <NavLink to="/" className={styles.logo}>
          StoryGen
        </NavLink>
        {navSlot}
        <NavLink to="/openai" className={styles.menu}>
          Open AI
        </NavLink>
        {navSlot}
        <div className={styles.space} />
        {children && <div className={styles.inner}>{children}</div>}
        <div className={styles.space} />
      </Container>
    </header>
  )
}
