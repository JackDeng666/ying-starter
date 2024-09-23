import { forwardRef, useImperativeHandle } from 'react'
import TextStyle from '@tiptap/extension-text-style'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Color from '@tiptap/extension-color'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor, Editor as TEditor } from '@tiptap/react'

import { cn } from '@/admin/utils/lib'

import { ToolBar } from './toolbar'
import './styles.scss'

export type EditorProps = {
  className?: string
  placeholder?: string
  defaultValue?: string
  onChange: (richText: string) => void
}

// tiptap 不适合做成受控组件
export const Editor = forwardRef<TEditor, EditorProps>(
  ({ className, defaultValue, onChange, placeholder = '请输入内容' }, ref) => {
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
      content: defaultValue,
      onUpdate: ({ editor }) => onChange(editor.getHTML())
    })

    useImperativeHandle(ref, () => editor)

    return (
      <div className="border border-[#f1f1f1] dark:border-[#424242] rounded-lg shadow-sm overflow-hidden relative">
        <ToolBar editor={editor} />
        <EditorContent editor={editor} className={cn('h-60 overflow-y-auto bg-[#fcfcfc]', className)} />
      </div>
    )
  }
)
