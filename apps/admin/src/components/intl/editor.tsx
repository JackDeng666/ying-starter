import { forwardRef, useEffect, useRef } from 'react'
import { Editor as TEditor } from '@tiptap/react'

import { TIntlText } from '@ying/shared/config'

import { Editor, EditorProps } from '@/admin/components/editor'

import { useIntl } from './use-intl'

type IntlEditorProps = Omit<EditorProps, 'value' | 'onChange'> & {
  value?: TIntlText
  onChange?: (val: TIntlText) => void
}

export const IntlEditor = forwardRef(({ value, onChange, ...props }: IntlEditorProps, ref) => {
  const editorRef = useRef<TEditor>()

  const { lng, intlValue, currentShowValue, radioContent } = useIntl({
    value
  })

  useEffect(() => {
    editorRef.current.commands.setContent(currentShowValue)
  }, [currentShowValue])

  return (
    <>
      {radioContent}
      <Editor
        {...props}
        defaultValue={currentShowValue}
        onChange={val => onChange({ ...intlValue, [lng]: val })}
        ref={editorRef}
      />
    </>
  )
})
