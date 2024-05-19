import { useRef } from 'react'
import { Modal } from 'antd'
import { CropImage, TCropImageHandle, TSaveRes } from './crop-image'

export type CropModalProps = {
  isOpen: boolean
  onClose: () => void
  url?: string
  onCrop?: (res: TSaveRes) => void
  aspectRatio?: number
}

export const CropModal = ({ isOpen, url, aspectRatio, onClose, onCrop }: CropModalProps) => {
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
    <Modal title="裁剪图片" open={isOpen} onCancel={onClose} onOk={onOk}>
      {url && <CropImage url={url} ref={ref} aspectRatio={aspectRatio} />}
    </Modal>
  )
}
