import { useEffect, useState } from 'react'
import { PlusOutlined, Loading3QuartersOutlined } from '@ant-design/icons'
import { FileEntity } from '@ying/shared/entities'
import { SelectFileType, selectFile, useUpload } from '@ying/hooks'
import { cn } from '@/admin/utils/lib'
import { CropModal, CropModalProps } from '@/admin/components/crop-image/crop-modal'
import { TSaveRes } from '@/admin/components/crop-image/crop-image'

type MinioUploadProps = {
  className?: string
  handleUpload: (file: File) => Promise<FileEntity>
  defaultUrl?: string
  onSuccess?: (file: FileEntity) => void
  withCrop?: boolean
  aspectRatio?: number
}

export const UploadImage = ({
  className,
  defaultUrl,
  withCrop,
  aspectRatio,
  onSuccess,
  handleUpload
}: MinioUploadProps) => {
  const [url, setUrl] = useState(defaultUrl)

  const { loading, startUpload } = useUpload({
    handleUpload,
    onSuccess: fileEntity => {
      setUrl(fileEntity.url)
      onSuccess && onSuccess(fileEntity)
    }
  })

  useEffect(() => {
    setUrl(defaultUrl)
  }, [defaultUrl])

  const [cropModalProps, setCropModalProps] = useState<CropModalProps>({
    isOpen: false,
    url: '',
    aspectRatio,
    onCrop(res: TSaveRes) {
      startUpload(res.file)
    },
    onClose: () => {
      setCropModalProps(prev => ({ ...prev, isOpen: false }))
    }
  })

  const handleSelect = async () => {
    const file = await selectFile(SelectFileType.Image)
    if (withCrop) {
      const url = URL.createObjectURL(file)
      setCropModalProps(prev => ({
        ...prev,
        url,
        isOpen: true
      }))
    } else {
      startUpload(file)
    }
  }

  return (
    <>
      <div
        className={cn('inline-block w-[110px] h-[110px] cursor-pointer overflow-hidden rounded-sm', className)}
        onClick={handleSelect}
      >
        {
          <div className="w-full h-full text-2xl fc bg-hover text-gray border-gray">
            {loading ? (
              <Loading3QuartersOutlined className="animate-spin" />
            ) : url ? (
              <img className="w-full h-full object-cover" src={url} alt="uploadedimage" />
            ) : (
              <PlusOutlined />
            )}
          </div>
        }
      </div>
      <CropModal {...cropModalProps} />
    </>
  )
}
