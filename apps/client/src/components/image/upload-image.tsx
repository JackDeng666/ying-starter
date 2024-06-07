import { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners'
import { Image, useDisclosure } from '@nextui-org/react'
import { SelectFileType, useUpload, selectFile } from '@ying/fontend-shared/hooks'
import { FileEntity } from '@ying/shared/entities'
import { cn } from '@/client/lib/utils'
import { PlusIcon } from '@/client/components/icons'
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
  const modalProps = useDisclosure()
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
      modalProps.onOpen()
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
        className={cn(
          'inline-block w-32 h-32 cursor-pointer overflow-hidden rounded-xl shadow-md',
          className,
          disabled && 'grayscale'
        )}
        onClick={handleSelect}
      >
        <div className="w-full h-full flex items-center justify-center bg-hover text-gray border-gray">
          {loading ? (
            <ScaleLoader />
          ) : url ? (
            <Image className="w-full h-full object-cover" removeWrapper src={url} alt="image" />
          ) : (
            <PlusIcon className="text-5xl" />
          )}
        </div>
      </div>
      <CropModal {...modalProps} url={blobUrl} onCrop={onCrop} aspectRatio={aspectRatio} />
    </>
  )
}
