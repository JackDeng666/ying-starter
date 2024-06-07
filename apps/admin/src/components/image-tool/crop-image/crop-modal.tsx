import { useRef } from 'react'
import { Modal } from 'antd'
import { CropImage, TCropImageHandle, TSaveRes } from './crop-image'

export type CropModalProps = {
  open: boolean
  onClose: () => void
  url?: string
  onCrop?: (res: TSaveRes) => void
  aspectRatio?: number
}

export const CropModal = ({ open, url, aspectRatio, onClose, onCrop }: CropModalProps) => {
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
      <CropImage ref={ref} url={url} aspectRatio={aspectRatio} />
    </Modal>
  )
}
