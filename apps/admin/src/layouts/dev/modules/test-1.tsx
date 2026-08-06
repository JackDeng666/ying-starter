import { Button, Space, Tabs } from 'antd'
import { JSX, useState } from 'react'

type TestTab = {
  label: string
  key: string
  com: JSX.Element
}

function Count() {
  const [count, setCount] = useState(0)
  return (
    <Space>
      Count: {count}
      <Button onClick={() => setCount(prev => prev + 1)}>increase</Button>
    </Space>
  )
}

const tabs: TestTab[] = [
  {
    label: 'Test1',
    key: 'test-1',
    com: <Count />
  },
  {
    label: 'Test2',
    key: 'test-2',
    com: <Count />
  }
]

export default function Test() {
  const [activeKey, setActiveKey] = useState('test-1')
  const [cachedTabs, setCachedTabs] = useState(['test-1'])

  const onChange = (key: string) => {
    setActiveKey(key)
    if (!cachedTabs.includes(key)) {
      setCachedTabs([...cachedTabs, key])
    }
  }

  return (
    <div className="mt-2">
      <Tabs onChange={onChange} activeKey={activeKey} items={tabs} />
      <div className="">
        {cachedTabs.map(key => {
          const currentTab = tabs.find(el => el.key === key)
          return (
            <div key={key} style={{ display: activeKey === key ? 'block' : 'none' }}>
              {currentTab.com}
            </div>
          )
        })}
      </div>
    </div>
  )
}
