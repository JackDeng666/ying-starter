import { useRef, useState } from 'react'

import { useDialogOpen } from '@ying/fontend-shared/hooks'

import { Button } from '@/client/components/ui/button'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose
} from '@/client/components/ui/dialog'
import { useTranslate } from '@/client/i18n/client'
import { CropImage, TCropImageHandle, TSaveRes } from './crop-image'

type CropModalProps = ReturnType<typeof useDialogOpen> & {
  url?: string
  onCrop?: (res: TSaveRes) => void
  aspectRatio?: number
}

export const CropModal = ({ open, url, aspectRatio, onOpenChange, onClose, onCrop }: CropModalProps) => {
  const { t } = useTranslate()
  const ref = useRef<TCropImageHandle>(null)
  const [loading, setLoading] = useState(false)

  const confirm = async () => {
    if (!ref.current) return
    try {
      setLoading(true)
      const res = await ref.current.save()
      if (res) {
        onCrop && onCrop(res)
      }
      onClose()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('crop_image')}</DialogTitle>
        </DialogHeader>
        {url && <CropImage url={url} ref={ref} aspectRatio={aspectRatio} />}
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">{t('close')}</Button>
          </DialogClose>
          <Button variant="default" loading={loading} onClick={confirm}>
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
