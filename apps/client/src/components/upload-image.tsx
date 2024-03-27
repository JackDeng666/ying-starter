import { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners'
import { PlusIcon } from '@radix-ui/react-icons'
import { SelectFileType, useUpload } from '@ying/hooks/use-upload'
import { FileEntity } from '@shared/entities'
import { cn } from '@/lib/utils'
import Image from 'next/image'

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
        'inline-block w-32 h-32 cursor-pointer overflow-hidden rounded-sm shadow-md',
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
            <Image className="w-full h-full object-cover" width={128} height={128} src={url} alt="image" />
          ) : (
            <PlusIcon className="w-8 h-8" />
          )}
        </div>
      }
    </div>
  )
}
