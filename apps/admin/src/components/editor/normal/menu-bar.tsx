import {
  LuBold,
  LuItalic,
  LuStrikethrough,
  LuListOrdered,
  LuList,
  LuBrackets,
  LuCode,
  LuUndo2,
  LuRedo2,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight
} from 'react-icons/lu'

import { useEditorContext, useEditorState, editorBaseStateSelector, MenuButton } from '@ying/frontend/editor'

import { MenuText, MenuTextColor, MenuBgColor, MenuLink, MenuImage, MenuImages } from '../menu'

const TextOptions = [
  { label: 'H1', value: 'h1' },
  { label: 'H2', value: 'h2' },
  { label: 'H3', value: 'h3' },
  { label: 'H4', value: 'h4' },
  { label: 'H5', value: 'h5' },
  { label: 'H6', value: 'h6' },
  { label: 'P', value: 'p' },
  { label: '-', value: '-' }
]

export const MenuBar = () => {
  const { editor } = useEditorContext()
  const state = useEditorState({
    editor,
    selector: editorBaseStateSelector
  })

  return (
    <div className="flex flex-wrap gap-2 border-b border-border p-2">
      <MenuText />
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!state.canBold}
        active={state.isBold}
      >
        <LuBold />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!state.canItalic}
        active={state.isItalic}
      >
        <LuItalic />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!state.canStrike}
        active={state.isStrike}
      >
        <LuStrikethrough />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={state.isBulletList}>
        <LuList />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={state.isOrderedList}>
        <LuListOrdered />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={state.isCodeBlock}>
        <LuCode />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={state.isBlockquote}>
        <LuBrackets />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>__</MenuButton>

      <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={state.isAlignLeft}>
        <LuAlignLeft />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={state.isAlignCenter}>
        <LuAlignCenter />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={state.isAlignRight}>
        <LuAlignRight />
      </MenuButton>

      <MenuTextColor />
      <MenuBgColor />
      <MenuLink />
      <MenuImage />
      <MenuImages />

      <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo}>
        <LuUndo2 />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo}>
        <LuRedo2 />
      </MenuButton>
    </div>
  )
}
