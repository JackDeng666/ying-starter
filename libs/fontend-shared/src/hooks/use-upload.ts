import { useState } from 'react'

export enum SelectFileType {
  Image,
  Video
}

export const selectFile: (type?: SelectFileType) => Promise<File> = type => {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'

    if (type === SelectFileType.Image) {
      input.accept = 'image/png,image/jpeg,image/jpg'
    } else if (type === SelectFileType.Video) {
      input.accept = 'video/mp4'
    }

    input.multiple = false

    input.onchange = async () => {
      const file = input.files?.[0]
      if (file) {
        resolve(file)
      }
    }

    input.click()
  })
}

type UseUploadOptions<T> = {
  handleUpload: (file: File) => Promise<T> | undefined
  onSuccess?: (res: T | undefined) => void
  onError?: (error: Error) => void
}

export const useUpload = <T>({ handleUpload, onSuccess, onError }: UseUploadOptions<T>) => {
  const [loading, setLoading] = useState(false)

  const start = (type?: SelectFileType) => {
    selectFile(type).then(async file => {
      try {
        setLoading(true)
        const res = await handleUpload(file)
        onSuccess && onSuccess(res)
      } catch (error: unknown) {
        onError && onError(error as Error)
      } finally {
        setLoading(false)
      }
    })
  }

  const startUpload = async (file: File) => {
    try {
      setLoading(true)
      const res = await handleUpload(file)
      onSuccess && onSuccess(res)
    } catch (error: unknown) {
      onError && onError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  return {
    start,
    startUpload,
    loading
  }
}
