import {
  LuBold,
  LuItalic,
  LuStrikethrough,
  LuListOrdered,
  LuList,
  LuBrackets,
  LuUndo2,
  LuRedo2,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight
} from 'react-icons/lu'
import { Select } from 'antd'

import { ToolButton } from './tool-button'
import { ImageTool } from './image-tool'
import { TextColorTool } from './text-color-tool'
import { BgColorTool } from './bg-color-tool'
import { EditorProps } from './type'

const TextOptions = [
  { label: 'H1', value: 'h1' },
  { label: 'H2', value: 'h2' },
  { label: 'H3', value: 'h3' },
  { label: 'H4', value: 'h4' },
  { label: 'H5', value: 'h5' },
  { label: 'H6', value: 'h6' },
  { label: 'P', value: 'p' }
]

export const ToolBar = ({ editor }: EditorProps) => {
  function calcActiveText() {
    if (!editor) return 'p'
    if (editor.isActive('paragraph')) {
      return 'p'
    }
    if (editor.isActive('heading', { level: 1 })) {
      return 'h1'
    }
    if (editor.isActive('heading', { level: 2 })) {
      return 'h2'
    }
    if (editor.isActive('heading', { level: 3 })) {
      return 'h3'
    }
    if (editor.isActive('heading', { level: 4 })) {
      return 'h4'
    }
    if (editor.isActive('heading', { level: 5 })) {
      return 'h5'
    }
    if (editor.isActive('heading', { level: 6 })) {
      return 'h6'
    }
    return 'p'
  }

  const activeText = calcActiveText()

  const selectText = (value: string) => {
    const chain = editor.chain().focus()
    let textAlign = undefined
    if (editor.isActive({ textAlign: 'left' })) {
      textAlign = 'left'
    }
    if (editor.isActive({ textAlign: 'center' })) {
      textAlign = 'center'
    }
    if (editor.isActive({ textAlign: 'right' })) {
      textAlign = 'right'
    }
    switch (value) {
      case 'p':
        chain.setParagraph().setTextAlign(textAlign).run()
        break
      case 'h1':
        chain.setHeading({ level: 1 }).setTextAlign(textAlign).run()
        break
      case 'h2':
        chain.setHeading({ level: 2 }).setTextAlign(textAlign).run()
        break
      case 'h3':
        chain.setHeading({ level: 3 }).setTextAlign(textAlign).run()
        break
      case 'h4':
        chain.setHeading({ level: 4 }).setTextAlign(textAlign).run()
        break
      case 'h5':
        chain.setHeading({ level: 5 }).setTextAlign(textAlign).run()
        break
      case 'h6':
        chain.setHeading({ level: 6 }).setTextAlign(textAlign).run()
        break
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 border-b border-[#f1f1f1] p-2">
      <Select
        style={{ width: 60, borderRadius: '0.375rem' }}
        value={activeText}
        onChange={selectText}
        options={TextOptions}
      />
      <ToolButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      >
        <LuBold />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
      >
        <LuItalic />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
      >
        <LuStrikethrough />
      </ToolButton>

      <ToolButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
      >
        <LuList />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
      >
        <LuListOrdered />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
      >
        <LuBrackets />
      </ToolButton>
      <ToolButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>__</ToolButton>

      <ToolButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
      >
        <LuAlignLeft />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
      >
        <LuAlignCenter />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
      >
        <LuAlignRight />
      </ToolButton>

      <TextColorTool editor={editor} />

      <BgColorTool editor={editor} />

      <ImageTool editor={editor} />

      <ToolButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <LuUndo2 />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <LuRedo2 />
      </ToolButton>
    </div>
  )
}
