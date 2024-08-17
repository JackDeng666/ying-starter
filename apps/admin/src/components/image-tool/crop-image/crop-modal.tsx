import { useRef } from 'react'
import { Modal } from 'antd'
import { useDialogOpen } from '@ying/fontend-shared/hooks'
import { CropImage, TCropImageHandle, TSaveRes } from './crop-image'

export type CropModalProps = ReturnType<typeof useDialogOpen<File>> & {
  onCrop?: (res: TSaveRes) => void
  aspectRatio?: number
}

export const CropModal = ({ open, onClose, formValue: file, aspectRatio, onCrop }: CropModalProps) => {
  const ref = useRef<TCropImageHandle>(null)

  const onOk = async () => {
    if (!ref.current) return
    const res = await ref.current.save()
    if (res) {
      onCrop && onCrop(res)
    }
    onClose()
  }

  return (
    <Modal title="裁剪图片" open={open} onCancel={onClose} onOk={onOk}>
      <CropImage
        ref={ref}
        url={file ? URL.createObjectURL(file) : ''}
        type={file?.type}
        name={file?.name}
        aspectRatio={aspectRatio}
      />
    </Modal>
  )
}
