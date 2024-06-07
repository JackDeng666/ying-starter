import { useEffect, useState } from 'react'
import { ColorPicker } from 'antd'
import { Color } from 'antd/es/color-picker'
import { FaFillDrip } from 'react-icons/fa'
import { AiOutlineClear } from 'react-icons/ai'

import { ToolButton } from './tool-button'
import { EditorProps } from './type'

export const BgColorTool = ({ editor }: EditorProps) => {
  const [color, setColor] = useState<string>('#000000')

  const focusColor = editor?.getAttributes('highlight').color

  useEffect(() => {
    if (focusColor) {
      setColor(focusColor)
    }
  }, [focusColor, setColor])

  const toggleColor = () => {
    editor.chain().focus().setHighlight({ color }).run()
  }

  const unsetColor = () => {
    editor.chain().focus().unsetHighlight().run()
  }

  const onChangeComplete = (color: Color) => {
    setColor(color.toHexString())
  }

  return (
    <div className="flex">
      <ToolButton className="rounded-r-none" onClick={toggleColor}>
        <FaFillDrip />
      </ToolButton>
      <ToolButton className="rounded-none border-l-0 border-r-0">
        <ColorPicker size="small" value={color} allowClear onChangeComplete={onChangeComplete} />
      </ToolButton>
      <ToolButton className="rounded-l-none" onClick={unsetColor}>
        <AiOutlineClear />
      </ToolButton>
    </div>
  )
}
