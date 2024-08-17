import { useEffect } from 'react'
import TextStyle from '@tiptap/extension-text-style'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Color from '@tiptap/extension-color'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/react'

import { cn } from '@/admin/utils/lib'

import { ToolBar } from './toolbar'
import './styles.scss'

type EditorProps = {
  className?: string
  placeholder?: string
  value: string
  onChange: (richText: string) => void
}

export default function Editor({ className, value, onChange, placeholder = '请输入内容' }: EditorProps) {
  const extensions = [
    StarterKit,
    TextStyle,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Highlight.configure({ multicolor: true }),
    Color.configure({
      types: ['textStyle']
    }),
    Image.configure({ inline: true }),
    Placeholder.configure({
      placeholder
    })
  ]

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  })

  useEffect(() => {
    editor.commands.setContent(value)
  }, [value, editor])

  return (
    <div className="border border-[#f1f1f1] rounded-lg shadow-sm overflow-hidden">
      <ToolBar editor={editor} />
      <EditorContent editor={editor} className={cn('h-60 overflow-y-auto bg-[#fcfcfc]', className)} />
    </div>
  )
}
