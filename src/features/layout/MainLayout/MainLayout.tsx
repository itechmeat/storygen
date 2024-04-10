import { FC, PropsWithChildren } from 'react'
import { Container } from '../../../components/Container/Container'
import { Headline } from '../Headline/Headline'
import styles from './MainLayout.module.scss'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Headline></Headline>

      <Container className={styles.content}>
        <main className={styles.main}>{children}</main>
      </Container>
    </div>
  )
}
