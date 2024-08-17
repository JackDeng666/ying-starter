import { useEffect, useState } from 'react'
import { Image } from 'antd'
import { EyeFilled, DeleteOutlined, PlusOutlined, DragOutlined } from '@ant-design/icons'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from '@hello-pangea/dnd'

import { FileEntity } from '@ying/shared/entities'

import { cn } from '@/admin/utils/lib'
import { ImageModal } from './image-modal'

type SelectImageProps = {
  className?: string
  maxLength?: number
  defaultValue?: FileEntity[] | FileEntity
  onChange?: (files: FileEntity[]) => void
}

export const SelectImage = ({ maxLength = 5, className, defaultValue, onChange }: SelectImageProps) => {
  const [previewUrl, setPreviewUrl] = useState('')
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState(
    defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []
  )

  const onSelect = (files: FileEntity[]) => {
    setImages(files)
    onChange?.(files)
  }

  const onDelete = (file: FileEntity) => {
    const newImages = images.filter(el => el.id !== file.id)
    setImages(newImages)
    onChange?.(newImages)
  }

  const onDragEnd: OnDragEndResponder = ({ destination, source }) => {
    // 拖拽到非法非 droppable 区域
    if (!destination) return
    // 原地放下
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const items = Array.from(images)

    const [reSortedItem] = items.splice(source.index, 1)
    items.splice(destination.index, 0, reSortedItem)

    setImages(items)
    onChange?.(items)
  }

  useEffect(() => {
    setImages(defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : [])
  }, [defaultValue])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="images" direction="horizontal">
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn('flex flex-wrap', maxLength > 1 && 'gap-4')}
          >
            {images.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id + ''} index={index}>
                {draggableProvided => (
                  <div
                    key={item.id}
                    className={cn(
                      'inline-block w-[110px] h-[110px] overflow-hidden rounded-md shadow-sm border border-gray/20',
                      className
                    )}
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                  >
                    <div className="w-full h-full fc bg-hover relative">
                      <Image src={item.url} preview={false} />
                      <div className="w-full h-full absolute left-0 top-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                        <EyeFilled
                          className="text-base text-white/90 absolute right-2 top-2 rounded-md p-1 bg-white/40 hover:bg-white/60"
                          onClick={e => {
                            setPreviewUrl(item.url)
                            e.stopPropagation()
                          }}
                        />
                        <DeleteOutlined
                          className="text-base text-white/90 absolute right-10 top-2 rounded-md p-1 bg-white/40 hover:bg-white/60"
                          onClick={e => {
                            onDelete(item)
                            e.stopPropagation()
                          }}
                        />
                        <DragOutlined
                          className="text-xl text-white/90 absolute left-[50%] top-[50%] translate-x-[-50%] rounded-md p-1 bg-white/40 hover:bg-white/60"
                          {...draggableProvided.dragHandleProps}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {images.length < maxLength && (
              <div
                className={cn(
                  'w-[110px] h-[110px] cursor-pointer overflow-hidden rounded-md shadow-sm border border-gray/20 text-2xl fc bg-hover text-gray',
                  className
                )}
                onClick={() => setOpen(true)}
              >
                <PlusOutlined />
              </div>
            )}
            <ImageModal
              files={images}
              open={open}
              onCancel={() => setOpen(false)}
              onSelect={onSelect}
              maxLength={maxLength}
            />
            <Image
              src={previewUrl}
              style={{ display: 'none' }}
              preview={{
                visible: !!previewUrl,
                onVisibleChange: value => {
                  if (!value) setPreviewUrl('')
                }
              }}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
