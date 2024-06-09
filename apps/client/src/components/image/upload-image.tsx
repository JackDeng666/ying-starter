import { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners'

import { SelectFileType, useUpload, selectFile, useDialogOpen } from '@ying/fontend-shared/hooks'
import { FileEntity } from '@ying/shared/entities'

import { PlusIcon } from '@/client/components/ui/icons'
import { cn } from '@/client/lib/utils'

import { CropModal } from './crop-modal'
import { TSaveRes } from './crop-image'

type UploadProps = {
  className?: string
  disabled?: boolean
  handleUpload: (file: File) => Promise<FileEntity> | undefined
  defaultUrl?: string
  onSuccess?: (file: FileEntity) => void
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
  const dialogProps = useDialogOpen()
  const [blobUrl, setBlobUrl] = useState<string>()
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

  const handleSelect = async () => {
    if (disabled) return
    const file = await selectFile(SelectFileType.Image)
    if (withCrop) {
      const url = URL.createObjectURL(file)
      setBlobUrl(url)
      dialogProps.onOpen()
    } else {
      startUpload(file)
    }
  }

  const onCrop = (res: TSaveRes) => {
    startUpload(res.file)
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
      <CropModal {...dialogProps} url={blobUrl} onCrop={onCrop} aspectRatio={aspectRatio} />
    </>
  )
}
