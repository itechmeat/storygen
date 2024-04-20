import { FC } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import styles from './Spinner.module.scss'

export const Spinner: FC = () => {
  return (
    <div className={styles.spinner}>
      <LoadingOutlined style={{ fontSize: '50px', color: '#08c' }} />
    </div>
  )
}
