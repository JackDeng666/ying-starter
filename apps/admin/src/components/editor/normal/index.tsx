import { useImperativeHandle, useState } from 'react'

import { useEditor, EditorRootContext, EditorContent, defaultExtensions, editorEmitter } from '@ying/frontend/editor'
import { cn } from '@ying/frontend/ui'

import { useThemeToken } from '@/theme/hooks'

import { EditorProps } from '../type'
import { MenuBar } from './menu-bar'

export const NormalEditor = ({
  ref,
  className,
  defaultValue,
  onChange,
  placeholder = '请输入内容',
  associatedFiles,
  emitter
}: EditorProps) => {
  const [dataEmpty, setDataEmpty] = useState(false)
  const editor = useEditor({
    extensions: defaultExtensions,
    content: defaultValue,
    onUpdate: ({ editor }) => {
      setDataEmpty(editor.isEmpty)
      onChange(editor.getHTML())
    }
  })

  useImperativeHandle(ref, () => ({
    setContent: val => {
      editor.commands.setContent(val, { emitUpdate: false })
      setTimeout(() => {
        setDataEmpty(editor.isEmpty)
      })
    }
  }))

  const themeToken = useThemeToken()

  return (
    <EditorRootContext.Provider value={{ editor, emitter: emitter ?? editorEmitter, associatedFiles }}>
      <div className="border border-border rounded-md overflow-hidden relative ">
        <MenuBar />
        <EditorContent
          editor={editor}
          data-empty={dataEmpty}
          data-placeholder={placeholder}
          className={cn(
            'h-140 p-3 overflow-y-auto data-[empty=true]:first:before:content-[attr(data-placeholder)] data-[empty=true]:first:before:ml-1 data-[empty=true]:first:before:pointer-events-none data-[empty=true]:first:before:float-left data-[empty=true]:first:before:h-0',
            className
          )}
          style={{
            backgroundColor: themeToken.colorBgContainerDisabled
          }}
        />
      </div>
    </EditorRootContext.Provider>
  )
}
