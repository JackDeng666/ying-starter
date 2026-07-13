import { useEffect, useState } from 'react'
import { ColorPicker } from 'antd'
import { Color } from 'antd/es/color-picker'
import { FaFillDrip } from 'react-icons/fa'
import { AiOutlineClear } from 'react-icons/ai'
import { useEditorContext, useEditorState, MenuButton } from '@ying/frontend/editor'

export const MenuBgColor = () => {
  const [color, setColor] = useState<string>('#000000')

  const { editor } = useEditorContext()
  const { focusColor, canBgColor } = useEditorState({
    editor,
    selector: ctx => ({
      focusColor: ctx.editor.getAttributes('textStyle').backgroundColor,
      canBgColor: ctx.editor.can().chain().setBackgroundColor('').run() ?? false
    })
  })

  useEffect(() => {
    if (focusColor) {
      setColor(focusColor)
    }
  }, [focusColor, setColor])

  const toggleColor = () => {
    editor.chain().focus().setBackgroundColor(color).run()
  }

  const unsetColor = () => {
    editor.chain().focus().unsetBackgroundColor().run()
  }

  const onChangeComplete = (color: Color) => {
    setColor(color.toHexString())
  }

  return (
    <div className="flex">
      <MenuButton className="rounded-r-none" disabled={!canBgColor} onClick={toggleColor}>
        <FaFillDrip />
      </MenuButton>
      <MenuButton className="rounded-none border-l-0 border-r-0" disabled={!canBgColor}>
        <ColorPicker size="small" disabled={!canBgColor} allowClear value={color} onChangeComplete={onChangeComplete} />
      </MenuButton>
      <MenuButton className="rounded-l-none" disabled={!canBgColor} onClick={unsetColor}>
        <AiOutlineClear />
      </MenuButton>
    </div>
  )
}
