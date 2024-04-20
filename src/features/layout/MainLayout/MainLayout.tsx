import { FC, PropsWithChildren } from 'react'
import { Layout as AntdLayout } from 'antd'
import { Container } from '../../../components/Container/Container'
import { Headline } from '../Headline/Headline'
import styles from './MainLayout.module.scss'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AntdLayout className={styles.layout}>
      <Headline></Headline>

      <Container className={styles.content}>
        <main className={styles.main}>{children}</main>
      </Container>
    </AntdLayout>
  )
}
