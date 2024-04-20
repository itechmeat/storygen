import { FC, PropsWithChildren, useState } from 'react'
import { Modal } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { UserKeysNames } from '../types'
import { useUserStore } from '../userStore'

type Props = {
  requiredKey: UserKeysNames | null
  onClose: () => void
  onOk: (key: string) => void
}

export const UserKeysProvider: FC<PropsWithChildren<Props>> = ({
  children,
  requiredKey,
  onClose,
  onOk,
}) => {
  const { updateKey } = useUserStore()

  const [confirmLoading, setConfirmLoading] = useState(false)
  const [value, setValue] = useState('')

  const handleOk = async () => {
    setConfirmLoading(true)
    if (requiredKey) {
      await updateKey(requiredKey, value)
    }
    setConfirmLoading(false)
    setValue('')
    onOk(value)
  }

  return (
    <>
      {children}

      <Modal
        title={`Input you ${requiredKey === UserKeysNames.OpenAIKeyName ? 'OpenAI' : 'TogetherAI'} API key`}
        open={!!requiredKey}
        onOk={handleOk}
        okText="Save in browser"
        confirmLoading={confirmLoading}
        onCancel={onClose}
      >
        <p>Your key will be saved in your browser. We do not store keys on the server.</p>
        <p>
          <TextArea defaultValue={value} rows={4} onChange={val => setValue(val.target.value)} />
        </p>
      </Modal>
    </>
  )
}
