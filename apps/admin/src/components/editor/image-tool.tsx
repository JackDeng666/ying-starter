import { useState } from 'react'
import { FaImage } from 'react-icons/fa'

import { FileEntity } from '@ying/shared/entities'

import { ImageModal } from '@/admin/components/image-tool/image-modal'

import { ToolButton } from './tool-button'
import { EditorProps } from './type'

export const ImageTool = ({ editor }: EditorProps) => {
  const [open, setOpen] = useState(false)

  const onSelectFiles = (files: FileEntity[]) => {
    const url = files?.[0]?.url

    if (url) {
      editor.chain().focus().setParagraph().setTextAlign('center').setImage({ src: url }).run()
    }
  }

  const selectImage = () => {
    setOpen(true)
  }

  return (
    <>
      <ToolButton onClick={selectImage}>
        <FaImage />
      </ToolButton>
      <ImageModal files={[]} open={open} onSelect={onSelectFiles} onCancel={() => setOpen(false)} />
    </>
  )
}
