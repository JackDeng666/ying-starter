import { useEffect, useState } from 'react'
import { PlusOutlined, BorderInnerOutlined, Loading3QuartersOutlined } from '@ant-design/icons'
import { FileEntity } from '@ying/shared/entities'
import { SelectFileType, selectFile, useUpload, UseUploadOptions } from '@ying/fontend-shared/hooks'
import { useDialogOpen } from '@ying/fontend-shared/hooks'
import { cn } from '@/admin/utils/lib'
import { CropModal } from '@/admin/components/image-tool/crop-image/crop-modal'

type UploadProps = UseUploadOptions<FileEntity> & {
  className?: string
  defaultUrl?: string
  mustCrop?: boolean
  aspectRatio?: number
  willSetUrl?: boolean
}

type SelectType = 'direct' | 'crop'

export const UploadImage = ({
  handleUpload,
  onSuccess,
  onError,
  className,
  defaultUrl,
  mustCrop,
  aspectRatio,
  willSetUrl = true
}: UploadProps) => {
  const [url, setUrl] = useState(defaultUrl)

  const { loading, startUpload } = useUpload<FileEntity>({
    handleUpload,
    onSuccess: fileEntity => {
      willSetUrl && setUrl(fileEntity.url)
      onSuccess && onSuccess(fileEntity)
    },
    onError
  })

  useEffect(() => {
    setUrl(defaultUrl)
  }, [defaultUrl])

  const cropModalProps = useDialogOpen<File>()

  const handleSelectFile = async (type: SelectType) => {
    const file = await selectFile(SelectFileType.Image)

    if (type === 'crop') {
      cropModalProps.onOpen(file)
    } else {
      startUpload(file)
    }
  }

  return (
    <>
      <div
        className={cn(
          'inline-block w-[110px] h-[110px] overflow-hidden rounded-md shadow-sm border border-gray/20 text-2xl fc bg-hover text-gray relative group',
          className
        )}
      >
        {loading ? (
          <Loading3QuartersOutlined className="animate-spin" />
        ) : url ? (
          <img className="w-full h-full object-cover" src={url} alt="uploadedimage" />
        ) : (
          <PlusOutlined className="transition-opacity duration-300 group-hover:opacity-0" />
        )}
        <div className="w-full h-full absolute left-0 top-0 bg-black/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 fc flex-col gap-2">
          <div
            className="text-white/90 rounded-md px-2 py-1.5 bg-white/40 hover:bg-white/50 cursor-pointer flex items-center gap-1"
            onClick={() => handleSelectFile('crop')}
          >
            <BorderInnerOutlined className="text-base" />
            <span className="text-sm">裁剪</span>
          </div>
          {!mustCrop && (
            <div
              className="text-white/90 rounded-md px-2 py-1.5 bg-white/40 hover:bg-white/50 cursor-pointer flex items-center gap-1"
              onClick={() => handleSelectFile('direct')}
            >
              <PlusOutlined className="text-base" />
              <span className="text-sm">直传</span>
            </div>
          )}
        </div>
      </div>
      <CropModal {...cropModalProps} onCrop={res => startUpload(res.file)} aspectRatio={aspectRatio} />
    </>
  )
}
