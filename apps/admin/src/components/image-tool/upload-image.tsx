import { useEffect, useState } from 'react'
import { PlusOutlined, Loading3QuartersOutlined } from '@ant-design/icons'
import { FileEntity } from '@ying/shared/entities'
import { SelectFileType, selectFile, useUpload } from '@ying/fontend-shared/hooks'
import { cn } from '@/admin/utils/lib'
import { CropModal, CropModalProps } from '@/admin/components/image-tool/crop-image/crop-modal'
import { TSaveRes } from '@/admin/components/image-tool/crop-image/crop-image'

type UploadProps = {
  className?: string
  handleUpload: (file: File) => Promise<FileEntity>
  defaultUrl?: string
  onSuccess?: (file: FileEntity) => void
  withCrop?: boolean
  aspectRatio?: number
  willSetUrl?: boolean
}

export const UploadImage = ({
  className,
  defaultUrl,
  withCrop,
  aspectRatio,
  onSuccess,
  handleUpload,
  willSetUrl = true
}: UploadProps) => {
  const [url, setUrl] = useState(defaultUrl)

  const { loading, startUpload } = useUpload({
    handleUpload,
    onSuccess: fileEntity => {
      willSetUrl && setUrl(fileEntity.url)
      onSuccess && onSuccess(fileEntity)
    }
  })

  useEffect(() => {
    setUrl(defaultUrl)
  }, [defaultUrl])

  const [cropModalProps, setCropModalProps] = useState<CropModalProps>({
    open: false,
    url: '',
    aspectRatio,
    onCrop(res: TSaveRes) {
      startUpload(res.file)
    },
    onClose: () => {
      setCropModalProps(prev => ({ ...prev, open: false, url: '' }))
    }
  })

  const handleSelect = async () => {
    const file = await selectFile(SelectFileType.Image)
    if (withCrop) {
      const url = URL.createObjectURL(file)
      setCropModalProps(prev => ({
        ...prev,
        url,
        open: true
      }))
    } else {
      startUpload(file)
    }
  }

  return (
    <>
      <div
        className={cn(
          'inline-block w-[110px] h-[110px] cursor-pointer overflow-hidden rounded-md shadow-sm border border-gray/20',
          className
        )}
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
