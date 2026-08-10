import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import type { InputRef } from 'antd'
import { Input, Tag, Tooltip } from 'antd'
import { ControllerRenderProps } from 'react-hook-form'
import { useThemeToken } from '@/hooks'

const tagInputStyle: CSSProperties = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: 'top'
}

export const Tags = ({ value, onChange }: ControllerRenderProps) => {
  const token = useThemeToken()
  const tags: string[] = value ?? []
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [editInputIndex, setEditInputIndex] = useState(-1)
  const [editInputValue, setEditInputValue] = useState('')
  const inputRef = useRef<InputRef>(null)
  const editInputRef = useRef<InputRef>(null)

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus()
    }
  }, [inputVisible])

  useEffect(() => {
    editInputRef.current?.focus()
  }, [editInputValue])

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag)
    onChange(newTags)
  }

  const showInput = () => {
    setInputVisible(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      onChange([...tags, inputValue])
    }
    setInputVisible(false)
    setInputValue('')
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value)
  }

  const handleEditInputConfirm = () => {
    const newTags = [...tags]
    newTags[editInputIndex] = editInputValue
    onChange(newTags)
    setEditInputIndex(-1)
    setEditInputValue('')
  }

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: 'dashed'
  }

  return (
    <div className="flex flex-wrap gap-1">
      {tags?.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              style={tagInputStyle}
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          )
        }
        const isLongTag = tag.length > 20
        const tagElem = (
          <Tag
            key={index}
            className="select-none"
            closable
            onClose={() => handleClose(tag)}
            onDoubleClick={e => {
              e.preventDefault()
              setEditInputIndex(index)
              setEditInputValue(tag)
            }}
          >
            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
          </Tag>
        )
        return isLongTag ? (
          <Tooltip key={index} title={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        )
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag className="cursor-pointer" style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
          添加
        </Tag>
      )}
    </div>
  )
}
