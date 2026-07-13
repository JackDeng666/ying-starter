import { useEffect, useState } from 'react'
import { ColorPicker } from 'antd'
import { Color } from 'antd/es/color-picker'
import { FaRegEdit } from 'react-icons/fa'
import { AiOutlineClear } from 'react-icons/ai'
import { useEditorContext, useEditorState, MenuButton } from '@ying/frontend/editor'

export const MenuTextColor = () => {
  const [color, setColor] = useState<string>('#000000')
  const { editor } = useEditorContext()
  const { focusColor, canTextColor } = useEditorState({
    editor,
    selector: ctx => ({
      focusColor: ctx.editor.getAttributes('textStyle').color,
      canTextColor: ctx.editor.can().chain().setColor('').run() ?? false
    })
  })

  useEffect(() => {
    if (focusColor) {
      setColor(focusColor)
    }
  }, [focusColor, setColor])

  const toggleColor = () => {
    editor.chain().focus().setColor(color).run()
  }

  const unsetColor = () => {
    editor.chain().focus().unsetColor().run()
  }

  const onChangeComplete = (color: Color) => {
    setColor(color.toHexString())
  }

  return (
    <div className="flex">
      <MenuButton className="rounded-r-none" disabled={!canTextColor} onClick={toggleColor}>
        <FaRegEdit />
      </MenuButton>
      <MenuButton className="rounded-none border-l-0 border-r-0" disabled={!canTextColor}>
        <ColorPicker
          size="small"
          disabled={!canTextColor}
          allowClear
          value={color}
          onChangeComplete={onChangeComplete}
        />
      </MenuButton>
      <MenuButton className="rounded-l-none" disabled={!canTextColor} onClick={unsetColor}>
        <AiOutlineClear />
      </MenuButton>
    </div>
  )
}
