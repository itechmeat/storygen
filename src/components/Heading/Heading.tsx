import { FC, PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import { Button, Input, InputRef } from 'antd'
import cn from 'classnames'
import styles from './Heading.module.scss'

type Props = {
  actions?: ReactNode
  title?: string
  className?: string
  isCentered?: boolean
  onChange?: (title: string) => void
}
export const Heading: FC<PropsWithChildren<Props>> = ({
  className,
  title,
  children,
  actions,
  isCentered,
  onChange,
}) => {
  const inputRef = useRef<InputRef>(null)

  const [value, setValue] = useState(title)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setValue(title)
  }, [title])

  useEffect(() => {
    if (isEditing) {
      inputRef.current!.focus({
        cursor: 'all',
      })
    }
  }, [isEditing])

  const handleChange = () => {
    if (onChange && value) {
      onChange(value)
    }
  }

  const handleBlur = () => {
    handleChange()
    setIsEditing(false)
  }

  return (
    <header className={cn(styles.header, { [styles.centered]: isCentered }, className)}>
      {!isEditing ? (
        <h1 className={styles.h1}>{value || children}</h1>
      ) : (
        <Input
          ref={inputRef}
          defaultValue={value}
          size="large"
          className={styles.input}
          onChange={val => setValue(val.target.value)}
          onBlur={handleBlur}
        />
      )}
      {onChange && !isEditing && (
        <Button
          type="text"
          icon={<EditOutlined />}
          className={styles.edit}
          onClick={() => setIsEditing(true)}
        />
      )}
      {actions}
    </header>
  )
}
