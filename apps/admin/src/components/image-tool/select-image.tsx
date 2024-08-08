import { useState } from 'react'
import { Image } from 'antd'
import { EyeFilled, DeleteOutlined, PlusOutlined, DragOutlined } from '@ant-design/icons'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from '@hello-pangea/dnd'

import { FileEntity } from '@ying/shared/entities'

import { cn } from '@/admin/utils/lib'
import { ImageModal } from './image-modal'

type SelectImageProps = {
  className?: string
  maxLength?: number
  value: FileEntity[]
  onChange: (files: FileEntity[]) => void
}

export const SelectImage = ({ maxLength = 1, className, value, onChange }: SelectImageProps) => {
  const [open, setOpen] = useState(false)

  const openSelect = async () => {
    setOpen(true)
  }

  const onSelect = (files: FileEntity[]) => {
    onChange(files)
  }

  const onDelete = (file: FileEntity) => {
    onChange(value.filter(el => el.id !== file.id))
  }

  const [previewUrl, setPreviewUrl] = useState('')

  const onDragEnd: OnDragEndResponder = ({ destination, source }) => {
    // 拖拽到非法非 droppable 区域
    if (!destination) return
    // 原地放下
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const items = Array.from(value)

    const [reSortedItem] = items.splice(source.index, 1)
    items.splice(destination.index, 0, reSortedItem)
    onChange(items)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="images" direction="horizontal">
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn('flex flex-wrap', maxLength > 1 && 'gap-4')}
          >
            {value.map((item, index) => (
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
            {value.length < maxLength && (
              <div
                className={cn(
                  'w-[110px] h-[110px] cursor-pointer overflow-hidden rounded-md shadow-sm border border-gray/20',
                  className
                )}
                onClick={openSelect}
              >
                <div className="w-full h-full text-2xl fc bg-hover text-gray border-gray">
                  <PlusOutlined />
                </div>
              </div>
            )}
            <ImageModal
              files={value}
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
