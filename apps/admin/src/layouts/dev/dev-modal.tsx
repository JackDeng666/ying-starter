import { useRef, useState } from 'react'
import { Drawer, Tabs, TabsProps } from 'antd'
import { useEvent } from '@ying/frontend/hooks'

const tabs: TabsProps['items'] = []
const initComponents = () => {
  const modules = import.meta.glob('./modules/*.tsx', { eager: true })
  Object.keys(modules).forEach(moduleKey => {
    const Component = (modules[moduleKey] as any).default as React.FC
    const key = moduleKey.split('/').at(-1)
    tabs.push({
      label: key,
      key,
      children: <Component />
    })
  })
}
initComponents()

export const DevModal = () => {
  const [open, setOpen] = useState(false)

  const pressedKeys = useRef(new Set())

  useEvent('keydown', event => {
    if (!event.key) return
    pressedKeys.current.add(event.key.toLowerCase())
    if (pressedKeys.current.has('d') && pressedKeys.current.has('e') && pressedKeys.current.has('v')) {
      setOpen(true)
    }
  })

  useEvent('keyup', event => {
    if (!event.key) return
    pressedKeys.current.delete(event.key.toLowerCase())
  })

  return (
    <Drawer title="开发" open={open} closeIcon={null} onClose={() => setOpen(false)} size="100%" placement="bottom">
      <Tabs items={tabs} />
    </Drawer>
  )
}
