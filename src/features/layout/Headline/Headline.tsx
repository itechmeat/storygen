import { FC, PropsWithChildren } from 'react'
import { DeleteOutlined, FileTextOutlined } from '@ant-design/icons'
import { Button, Menu, Popconfirm } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { MenuInfo } from 'rc-menu/lib/interface'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { clearDatabase } from '../../../api/db'
import { Container } from '../../../components/Container/Container'
import styles from './Headline.module.scss'

export const Headline: FC<PropsWithChildren> = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { width } = useWindowSize()

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
      key: '/dall-e-3',
      label: 'DALL·E 3',
    },
    {
      key: '/stories',
      label: 'Stories',
    },
  ]

  const handleMenuClick = (val: MenuInfo) => {
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

        <Popconfirm
          placement="bottom"
          title="Are you sure to clear your local database?"
          description="Once the database is deleted, you cannot undo this action"
          okText="Yes"
          cancelText="No"
          onConfirm={clearDatabase}
        >
          {width > 800 ? (
            <Button icon={<DeleteOutlined />}>
              <span className={styles.clearText}>Clear Database</span>
            </Button>
          ) : (
            <Button icon={<DeleteOutlined />} />
          )}
        </Popconfirm>
      </Container>
    </Header>
  )
}
