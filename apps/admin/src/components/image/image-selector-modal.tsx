import { useEffect, useState } from 'react'
import { Modal } from 'antd'

import type { FileEntity } from '@ying/entity'

import { ImageList } from './image-list'

type ImageSelectorModalProps = {
  files: FileEntity[]
  open: boolean
  onSelect: (files: FileEntity[]) => void
  onCancel: VoidFunction
  maxLength?: number
}

export const ImageSelectorModal = ({ files, open, onSelect, onCancel, maxLength = 1 }: ImageSelectorModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileEntity[]>(files)

  useEffect(() => {
    setSelectedFiles(files)
  }, [files])

  const onOk = () => {
    onSelect(selectedFiles)
    onCancel()
  }

  return (
    <Modal open={open} onCancel={onCancel} width="1040px" title="选择图片" onOk={onOk}>
      <ImageList selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} maxLength={maxLength} />
    </Modal>
  )
}
