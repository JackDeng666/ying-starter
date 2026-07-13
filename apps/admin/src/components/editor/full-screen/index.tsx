import { useImperativeHandle, useState, type ReactNode } from 'react'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'

import { useEditor, EditorRootContext, EditorContent, defaultExtensions, editorEmitter } from '@ying/frontend/editor'
import { cn } from '@ying/frontend/ui'

import { EditorProps } from '../type'
import { MenuBar } from './menu-bar'

type FullScreenEditorProps = EditorProps & {
  extra?: ReactNode
}

const previewClassMap = {
  1: {
    w: 'w-1/3',
    mx: 'mx-40'
  },
  2: {
    w: 'w-2/3',
    mx: 'mx-20'
  },
  3: {
    w: 'w-full',
    mx: 'mx-0'
  }
}

type PreviewKeys = keyof typeof previewClassMap

export const FullScreenEditor = ({
  ref,
  className,
  defaultValue,
  onChange,
  placeholder = '请输入内容',
  associatedFiles,
  emitter,
  extra
}: FullScreenEditorProps) => {
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

  const [previewSize, setPreviewSize] = useState(3)
  return (
    <EditorRootContext.Provider value={{ editor, emitter: emitter ?? editorEmitter, associatedFiles }}>
      <div className="relative h-full ml-39 mr-3 xl:mx-50 2xl:mx-60">
        <EditorContent
          editor={editor}
          data-empty={dataEmpty}
          data-placeholder={placeholder}
          className={cn(
            'bg-white shadow-xs rounded-md h-180 p-3 overflow-y-auto text-base data-[empty=true]:first:before:content-[attr(data-placeholder)] data-[empty=true]:first:before:ml-1 data-[empty=true]:first:before:pointer-events-none data-[empty=true]:first:before:float-left data-[empty=true]:first:before:h-0',
            previewClassMap[previewSize as PreviewKeys].mx,
            className
          )}
          style={{
            transition: 'margin 300ms 0ms'
          }}
        />
        <div className="absolute top-0 -left-36 w-33 flex flex-col gap-2 ">
          <MenuBar />
          <div className="rounded-md shadow-xs p-2 bg-white flex flex-col items-center gap-1">
            <div>预览窗口大小</div>
            <div
              className={cn(
                'flex items-center justify-between w-full h-7 cursor-pointer',
                previewClassMap[previewSize as PreviewKeys].w
              )}
              style={{
                transition: 'width 300ms 0ms'
              }}
              onClick={() => {
                setPreviewSize(s => {
                  if (s - 1 < 1) {
                    return 3
                  } else {
                    return s - 1
                  }
                })
              }}
            >
              <LuArrowLeft />
              <div className="flex grow border-b border-dashed" />
              <LuArrowRight />
            </div>
          </div>
          {extra}
        </div>
      </div>
    </EditorRootContext.Provider>
  )
}
