import { ThunderboltOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'

export const HomePage = () => {
  return (
    <div>
      <Result
        icon={<ThunderboltOutlined />}
        title="Let's make up a new story!"
        extra={
          <Button type="primary" href="/stories">
            Start writing!
          </Button>
        }
      />
    </div>
  )
}
