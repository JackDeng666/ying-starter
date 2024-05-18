import { useRef } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { useTranslate } from '@/client/i18n/client'
import { CropImage, TCropImageHandle, TSaveRes } from './crop-image'

type CropModalProps = {
  isOpen: boolean
  onOpenChange: () => void
  onClose: () => void
  url?: string
  onCrop?: (res: TSaveRes) => void
  aspectRatio?: number
}

export const CropModal = ({ isOpen, url, aspectRatio, onOpenChange, onClose, onCrop }: CropModalProps) => {
  const { t } = useTranslate()
  const ref = useRef<TCropImageHandle>(null)

  const confirm = async () => {
    if (!ref.current) return
    const res = await ref.current.save()
    if (res) {
      onCrop && onCrop(res)
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">{t('crop_image')}</ModalHeader>
            <ModalBody>{url && <CropImage url={url} ref={ref} aspectRatio={aspectRatio} />}</ModalBody>
            <ModalFooter>
              <Button color="default" variant="ghost" onPress={onClose}>
                {t('close')}
              </Button>
              <Button color="primary" onPress={confirm}>
                {t('confirm')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
