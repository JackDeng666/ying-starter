import { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners'

import { SelectFileType, useUpload, selectFile, useDialogOpen, UseUploadOptions } from '@ying/fontend-shared/hooks'
import { FileEntity } from '@ying/shared/entities'

import { PlusIcon } from '@/client/components/ui/icons'
import { cn } from '@/client/lib/utils'

import { CropModal } from './crop-modal'

type UploadProps = UseUploadOptions<FileEntity> & {
  className?: string
  disabled?: boolean
  defaultUrl?: string
  withCrop?: boolean
  aspectRatio?: number
}

export const UploadImage = ({
  className,
  disabled,
  defaultUrl,
  withCrop,
  aspectRatio,
  onSuccess,
  handleUpload
}: UploadProps) => {
  const [url, setUrl] = useState(defaultUrl)

  const { loading, startUpload } = useUpload({
    handleUpload,
    onSuccess: fileEntity => {
      if (!fileEntity) return
      setUrl(fileEntity.url)
      onSuccess && onSuccess(fileEntity)
    }
  })

  useEffect(() => {
    setUrl(defaultUrl)
  }, [defaultUrl])

  const cropModalProps = useDialogOpen<File>()

  const handleSelect = async () => {
    if (disabled) return
    const file = await selectFile(SelectFileType.Image)
    if (withCrop) {
      cropModalProps.onOpen(file)
    } else {
      startUpload(file)
    }
  }

  return (
    <>
      <div
        className={cn('inline-block w-32 h-32 cursor-pointer', className, disabled && 'grayscale')}
        onClick={handleSelect}
      >
        <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-md border shadow-sm text-muted-foreground bg-muted">
          {loading ? (
            <ScaleLoader />
          ) : url ? (
            <img className="w-full h-full object-cover" src={url} alt="image" />
          ) : (
            <PlusIcon className="text-5xl" />
          )}
        </div>
      </div>
      <CropModal {...cropModalProps} onCrop={res => startUpload(res.file)} aspectRatio={aspectRatio} />
    </>
  )
}
