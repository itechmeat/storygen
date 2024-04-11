import { FC, PropsWithChildren } from 'react'
import { FileTextOutlined } from '@ant-design/icons'
import { Button, Menu } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { MenuInfo } from 'rc-menu/lib/interface'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { clearDatabase } from '../../../api/db'
import { Container } from '../../../components/Container/Container'
import styles from './Headline.module.scss'

export const Headline: FC<PropsWithChildren> = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const items = [
    {
      key: '/openai',
      label: 'Open AI',
    },
    {
      key: '/together',
      label: 'Together AI',
    },
    {
      key: '/stories',
      label: 'Stories',
    },
  ]

  const handleMenuClick = (val: MenuInfo) => {
    console.log('🚀 ~ handleMenuClick ~ val:', val)
    navigate(val.key)
  }

  return (
    <Header className={styles.header}>
      <Container className={styles.wrapper}>
        <NavLink to="/" className={styles.logo}>
          <FileTextOutlined />
          StoryGen
        </NavLink>

        <Menu
          className={styles.menu}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[pathname]}
          items={items}
          onClick={val => handleMenuClick(val)}
        />

        <Button onClick={clearDatabase}>Clear Database</Button>
      </Container>
    </Header>
  )
}
