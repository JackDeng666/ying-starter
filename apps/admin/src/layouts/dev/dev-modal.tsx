import { Modal } from 'antd'
import { useRef, useState } from 'react'
import { useEvent } from 'react-use'
import './full-screen-modal.css'

const Components: React.FC[] = []
const initComponents = () => {
  const modules = import.meta.glob('./modules/*.tsx', { eager: true })
  Object.keys(modules).forEach(key => {
    Components.push((modules as object)[key].default as React.FC)
  })
}
initComponents()

export const DevModal = () => {
  const [open, setOpen] = useState(false)

  const pressedKeys = useRef(new Set())

  const handleDev = (event: KeyboardEvent) => {
    if (!event.key) return
    pressedKeys.current.add(event.key.toLowerCase())
    if (pressedKeys.current.has('d') && pressedKeys.current.has('e') && pressedKeys.current.has('v')) {
      setOpen(true)
    }
  }
  const handleKeyUp = (event: KeyboardEvent) => {
    if (!event.key) return
    pressedKeys.current.delete(event.key.toLowerCase())
  }

  useEvent('keydown', handleDev)
  useEvent('keyup', handleKeyUp)

  return (
    <Modal title="开发" open={open} onCancel={() => setOpen(false)} footer={null} className="full-screen-modal">
      <div className="h-[calc(100vh-72px)] overflow-y-auto">
        {Components.map((Com, index) => (
          <Com key={index} />
        ))}
      </div>
    </Modal>
  )
}
