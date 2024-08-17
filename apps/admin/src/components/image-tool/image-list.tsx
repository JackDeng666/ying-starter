import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { Pagination, Spin, Image, message, Popconfirm } from 'antd'
import { useForm } from 'react-hook-form'
import { EyeFilled, CheckCircleFilled, DeleteOutlined } from '@ant-design/icons'

import { ListFileDto, FileType, FileSourceType } from '@ying/shared'
import { FileEntity } from '@ying/shared/entities'
import { debounce } from '@ying/utils'

import { commonApi } from '@/admin/api'
import { usePage } from '@/admin/hooks/use-page'
import { useThemeToken } from '@/admin/theme/hooks'

import { UploadImage } from './upload-image'

type ImageListProps = {
  selectedFiles?: FileEntity[]
  setSelectedFiles?: Dispatch<SetStateAction<FileEntity[]>>
  maxLength?: number
}

export const ImageList = ({ selectedFiles, setSelectedFiles, maxLength = 1 }: ImageListProps) => {
  const token = useThemeToken()
  const { watch, getValues } = useForm<ListFileDto>({
    defaultValues: { type: FileType.Image, from: FileSourceType.Admin }
  })

  const { list, listLoading, pagination, reload } = usePage({
    listApi: useCallback(
      ({ page, size }) =>
        commonApi.listFile({
          ...getValues(),
          page,
          size
        }),
      [getValues]
    ),
    listCount: useCallback(
      () =>
        commonApi.listFileCount({
          ...getValues()
        }),
      [getValues]
    ),
    defaultPageSize: 30
  })

  useEffect(() => {
    const subscription = watch(debounce(reload, 500))
    return () => subscription.unsubscribe()
  }, [watch, reload])

  const [previewUrl, setPreviewUrl] = useState('')
  const selectedFileIds = selectedFiles?.map(el => el.id) || []

  const onClick = (file: FileEntity) => {
    if (!setSelectedFiles) return
    const index = selectedFileIds.findIndex(id => id === file.id)
    // 选择新图片
    if (index === -1) {
      // 只能选一张图片时直接切换
      if (maxLength === 1) {
        return setSelectedFiles([file])
      }
      if (selectedFiles.length >= maxLength) {
        return message.warning(`图片最多可选${maxLength}张`)
      }
      setSelectedFiles(prev => [...prev, file])
    } else {
      setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
    }
  }

  return (
    <Spin spinning={listLoading}>
      <div className="flex flex-wrap gap-4">
        <UploadImage
          handleUpload={(file, fileInfo) => commonApi.uploadImage(file, fileInfo)}
          onSuccess={reload}
          willSetUrl={false}
        />
        {list?.map(el => {
          const isSelected = selectedFileIds.includes(el.id)
          return (
            <div
              className="w-[110px] h-[110px] cursor-pointer rounded-md fc transition-colors duration-300"
              key={el.id}
              style={{
                borderColor: isSelected ? token.colorPrimary : token.colorBgContainer,
                borderWidth: isSelected && '2px'
              }}
            >
              <div className="w-[106px] h-[106px] overflow-hidden fc rounded-md bg-hover border border-gray/20 relative">
                <Image src={el.url} preview={false} />
                {isSelected && (
                  <CheckCircleFilled
                    className="absolute left-2 bottom-2 text-base"
                    style={{ color: token.colorPrimary }}
                  />
                )}
                <div
                  className="w-full h-full absolute left-0 top-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={() => onClick(el)}
                >
                  <Popconfirm
                    title="确定删除？"
                    okText="确定"
                    cancelText="取消"
                    placement="left"
                    onPopupClick={e => {
                      e.stopPropagation()
                    }}
                    onConfirm={async () => {
                      await commonApi.deleteFile(el.id)
                      message.success('删除成功！')
                      reload()
                    }}
                  >
                    <DeleteOutlined
                      className="text-base text-white/90 absolute right-10 top-2 rounded-md p-1 bg-white/40 hover:bg-white/60"
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    />
                  </Popconfirm>

                  <EyeFilled
                    className="text-base text-white/90 absolute right-2 top-2 rounded-md p-1 bg-white/40 hover:bg-white/60"
                    onClick={e => {
                      setPreviewUrl(el.url)
                      e.stopPropagation()
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-end mt-4">
        <Pagination {...pagination} />
      </div>
      {previewUrl && (
        <Image
          style={{ display: 'none' }}
          src={previewUrl}
          preview={{
            visible: !!previewUrl,
            onVisibleChange: value => {
              if (!value) setPreviewUrl('')
            }
          }}
        />
      )}
    </Spin>
  )
}
