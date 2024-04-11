import { FC, PropsWithChildren, ReactNode } from 'react'
import { FileTextOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { NavLink } from 'react-router-dom'
import { clearDatabase } from '../../../api/db'
import { Container } from '../../../components/Container/Container'
import styles from './Headline.module.scss'

type Props = {
  navSlot?: ReactNode
  userSlot?: ReactNode
}

export const Headline: FC<PropsWithChildren<Props>> = ({ navSlot, children }) => {
  const menu = [
    {
      to: '/openai',
      name: 'Open AI',
    },
    {
      to: '/together',
      name: 'Together AI',
    },
    {
      to: '/stories',
      name: 'Stories',
    },
  ]

  return (
    <header className={styles.header}>
      <Container className={styles.wrapper}>
        <NavLink to="/" className={styles.logo}>
          <FileTextOutlined />
          StoryGen
        </NavLink>
        <div className={styles.space} />
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) => (isActive ? styles.activeMenu : styles.menu)}
          >
            {item.name}
          </NavLink>
        ))}
        {navSlot}
        <div className={styles.space} />
        {children && <div className={styles.inner}>{children}</div>}
        <div className={styles.space} />
        <Button onClick={clearDatabase}>Clear Database</Button>
      </Container>
    </header>
  )
}
