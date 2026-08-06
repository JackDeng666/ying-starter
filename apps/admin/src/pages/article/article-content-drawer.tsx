import { useCallback, useEffect, useRef, useState } from 'react'
import { App, Drawer, Button, Space } from 'antd'
import { useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import { useQuery } from '@tanstack/react-query'

import { uniqueBy } from '@ying/utils'
import { clientLanguagesConfig, LngKeys } from '@ying/shared'
import type { FileEntity } from '@ying/entity'
import { UpdateArticleContentDto } from '@ying/dto'
import { useDialogOpen, useRemount } from '@ying/frontend/hooks'
import { editorEmitter } from '@ying/frontend/editor'

import { EditorHandle, FullScreenEditor } from '@/components/editor'
import { IntlSwitch } from '@/components/intl'
import { articleApi } from '@/api'
import { useThemeToken } from '@/hooks'

const { fallbackLng } = clientLanguagesConfig

type ArticleContentDrawerProps = ReturnType<typeof useDialogOpen<number>> & {
  onSuccess?: VoidFunction
}

export function ArticleContentDrawer({ open, formValue, onSuccess, onClose }: ArticleContentDrawerProps) {
  const title = `编辑文章内容`
  const { message } = App.useApp()
  const { colorBgLayout, colorBgContainer } = useThemeToken()
  const {
    handleSubmit,
    formState: { isDirty, isSubmitting },
    reset,
    getValues,
    setValue
  } = useForm<UpdateArticleContentDto>({
    resolver: classValidatorResolver(UpdateArticleContentDto)
  })

  const { data: article, isFetching: loading } = useQuery({
    queryKey: ['article-detail', formValue],
    queryFn: () => articleApi.detail(formValue!),
    enabled: !!formValue,
    refetchOnWindowFocus: false
  })

  const { renderKey, setRenderKey } = useRemount()

  const [associatedFiles, setAssociatedFiles] = useState<FileEntity[]>()
  useEffect(() => {
    if (article) {
      reset({
        id: article.id,
        content: article.content,
        associatedFileIds: article.associatedFiles?.map(el => el.id)
      })
      setAssociatedFiles(article.associatedFiles)
      setRenderKey(key => key + 1)
    } else {
      reset({})
      setAssociatedFiles(undefined)
    }
  }, [article, reset, setRenderKey])

  const onAddAssociatedFiles = useCallback(
    (files: FileEntity[]) => {
      const newFiles = [...(associatedFiles ?? []), ...files]
      setAssociatedFiles(uniqueBy(newFiles, 'id'))
    },
    [associatedFiles]
  )

  useEffect(() => {
    editorEmitter.on('add-associated-files', onAddAssociatedFiles)
    return () => editorEmitter.off('add-associated-files', onAddAssociatedFiles)
  }, [onAddAssociatedFiles])

  const handlePost = async (value: UpdateArticleContentDto) => {
    await articleApi.updateContent(value)
    message.success(`${title}成功`)
    onSuccess?.()
    onClose()
  }
  const submit = handleSubmit(handlePost)
  const processingAssociatedFiles = () => {
    if (!associatedFiles) return
    setValue(
      'associatedFileIds',
      associatedFiles.map(el => el.id)
    )
  }
  const comfirm = () => {
    processingAssociatedFiles()
    submit()
  }

  const editorRef = useRef<EditorHandle>(null)
  const [currentLng, setCurrentLng] = useState<LngKeys>(fallbackLng)
  const onChangeLng = (val: LngKeys) => {
    if (!editorRef.current) return
    const { content } = getValues()
    const targetContent = content?.[val]
    if (targetContent) editorRef.current.setContent(targetContent)
    else editorRef.current.setContent('')
    setCurrentLng(val)
  }

  return (
    <Drawer
      title={title}
      open={open}
      closeIcon={null}
      onClose={onClose}
      loading={loading}
      size="100%"
      placement="top"
      styles={{
        body: {
          padding: 12,
          background: colorBgLayout
        }
      }}
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" disabled={!isDirty} loading={isSubmitting} onClick={comfirm}>
            确认
          </Button>
        </Space>
      }
    >
      <FullScreenEditor
        ref={editorRef}
        key={renderKey}
        defaultValue={article?.content?.[currentLng]}
        onChange={val => setValue(`content.${currentLng}`, val, { shouldDirty: true })}
        associatedFiles={associatedFiles}
        emitter={editorEmitter}
        rightToolExtra={
          <div
            className="rounded-md shadow-xs p-2 flex flex-col items-center gap-1"
            style={{
              background: colorBgContainer
            }}
          >
            <div>语言</div>
            <IntlSwitch className="gap-y-0!" vertical optionType="default" value={currentLng} onChange={onChangeLng} />
          </div>
        }
      />
    </Drawer>
  )
}
