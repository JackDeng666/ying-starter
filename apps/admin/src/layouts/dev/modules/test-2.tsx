import { Button } from 'antd'

export default function Test() {
  return (
    <div className="mt-2">
      <Button
        onClick={() => {
          console.log('test2')
        }}
      >
        测试
      </Button>
    </div>
  )
}
