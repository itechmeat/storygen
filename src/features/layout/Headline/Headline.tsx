import { FC, PropsWithChildren } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Menu, Popconfirm } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { MenuInfo } from 'rc-menu/lib/interface'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { clearDatabase } from '../../../api/db'
import LogoIcon from '../../../assets/images/logo.svg'
import { Container } from '../../../components/Container/Container'
import { LanguageSelector } from '../../localization/LanguageSelector/LanguageSelector'
import { useMedia } from '../hooks/media.hook'
import styles from './Headline.module.scss'

export const Headline: FC<PropsWithChildren> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isMobile } = useMedia()

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
      label: t('StoryPage.stories'),
    },
  ]

  const handleMenuClick = (val: MenuInfo) => {
    navigate(val.key)
  }

  return (
    <Header className={styles.header}>
      <Container className={styles.wrapper}>
        <NavLink to="/" className={styles.logo}>
          <LogoIcon />
          <span className={styles.logoText}>StoryGen</span>
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
          title={t('notices.deleteDB')}
          description={t('notices.deleteDBDescription')}
          okText={t('actions.yes')}
          cancelText={t('actions.no')}
          onConfirm={clearDatabase}
        >
          {!isMobile ? (
            <Button icon={<DeleteOutlined />}>
              <span className={styles.clearText}>{t('actions.clearDatabase')}</span>
            </Button>
          ) : (
            <Button icon={<DeleteOutlined />} />
          )}
        </Popconfirm>

        <LanguageSelector />
      </Container>
    </Header>
  )
}
