import { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners'
import { Image } from '@nextui-org/react'
import { SelectFileType, useUpload } from '@ying/hooks'
import { FileEntity } from '@ying/shared/entities'
import { cn } from '@/lib/utils'
import { PlusIcon } from './icons'

type UploadProps = {
  className?: string
  disabled?: boolean
  handleUpload: (file: File) => Promise<FileEntity>
  defaultUrl?: string
  onSuccess?: (file: FileEntity) => void
}

export const UploadImage = ({ className, disabled, defaultUrl, onSuccess, handleUpload }: UploadProps) => {
  const [url, setUrl] = useState(defaultUrl)

  const { loading, start } = useUpload({
    handleUpload,
    onSuccess: fileEntity => {
      setUrl(fileEntity.url)
      onSuccess && onSuccess(fileEntity)
    }
  })

  useEffect(() => {
    setUrl(defaultUrl)
  }, [defaultUrl])

  return (
    <div
      className={cn(
        'inline-block w-32 h-32 cursor-pointer overflow-hidden rounded-xl shadow-md',
        className,
        disabled && 'grayscale'
      )}
      onClick={() => {
        if (disabled) return
        start(SelectFileType.Image)
      }}
    >
      {
        <div className="w-full h-full flex items-center justify-center bg-hover text-gray border-gray">
          {loading ? (
            <ScaleLoader />
          ) : url ? (
            <Image className="w-full h-full object-cover" removeWrapper src={url} alt="image" />
          ) : (
            <PlusIcon className="text-5xl" />
          )}
        </div>
      }
    </div>
  )
}
