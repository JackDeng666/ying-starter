import { useEffect, useState } from 'react'
import { Modal } from 'antd'

import { FileEntity } from '@ying/shared/entities'

import { ImageList } from './image-list'

type ImageModalProps = {
  files: FileEntity[]
  open: boolean
  onSelect: (files: FileEntity[]) => void
  onCancel: VoidFunction
  maxLength?: number
}

export const ImageModal = ({ files, open, onSelect, onCancel, maxLength = 1 }: ImageModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileEntity[]>(files)

  useEffect(() => {
    setSelectedFiles(files)
  }, [files])

  const onOk = () => {
    onSelect(selectedFiles)
    onCancel()
  }

  return (
    <Modal open={open} onCancel={onCancel} width="75%" title="选择图片" onOk={onOk}>
      <ImageList selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} maxLength={maxLength} />
    </Modal>
  )
}
