import { useEffect, useState } from 'react'
import { PlusOutlined, Loading3QuartersOutlined } from '@ant-design/icons'
import { FileEntity } from '@ying/shared/entities'
import { SelectFileType, useUpload } from '@ying/hooks'
import { cn } from '@/utils/lib'

type MinioUploadProps = {
  className?: string
  handleUpload: (file: File) => Promise<FileEntity>
  defaultUrl?: string
  onSuccess?: (file: FileEntity) => void
}

export const UploadImage = ({ className, defaultUrl, onSuccess, handleUpload }: MinioUploadProps) => {
  const [url, setUrl] = useState(defaultUrl)

  const { loading, start } = useUpload({
    handleUpload,
    onSuccess: minioFile => {
      setUrl(minioFile.url)
      onSuccess && onSuccess(minioFile)
    }
  })

  useEffect(() => {
    setUrl(defaultUrl)
  }, [defaultUrl])

  return (
    <div
      className={cn('inline-block w-[110px] h-[110px] cursor-pointer overflow-hidden rounded-sm', className)}
      onClick={() => {
        start(SelectFileType.Image)
      }}
    >
      {
        <div className="w-full h-full text-2xl fc bg-hover text-gray border-gray">
          {loading ? (
            <Loading3QuartersOutlined className="animate-spin" />
          ) : url ? (
            <img className="w-full h-full object-cover" src={url} />
          ) : (
            <PlusOutlined />
          )}
        </div>
      }
    </div>
  )
}
