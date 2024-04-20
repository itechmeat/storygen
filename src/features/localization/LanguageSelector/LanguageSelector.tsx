import { FC } from 'react'
import { Select, SelectProps, Space } from 'antd'
import { useTranslation } from 'react-i18next'

export const LanguageSelector: FC = () => {
  const { i18n } = useTranslation()

  const options: SelectProps['options'] = [
    {
      label: 'EN',
      value: 'en',
      emoji: '🇺🇸',
    },
    {
      label: 'RU',
      value: 'ru',
      emoji: '🇷🇺',
    },
  ]

  const handleChange = (value: string) => {
    i18n.changeLanguage(value)
  }

  return (
    <Select
      defaultValue={i18n.language}
      onChange={handleChange}
      options={options}
      optionRender={option => (
        <Space>
          <span role="img" aria-label={option.data.label}>
            {option.data.emoji}
          </span>
          {option.data.desc}
        </Space>
      )}
    />
  )
}
