import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import type { InputRef } from 'antd'
import { Flex, Input, Tag, Tooltip } from 'antd'

import { useThemeToken } from '@/admin/theme/hooks'
import { ControllerRenderProps } from 'react-hook-form'

const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: 'top'
}

export const TagsEdit = forwardRef<undefined, ControllerRenderProps>(({ value, onChange }, ref) => {
  useImperativeHandle(ref, () => undefined)

  const token = useThemeToken()
  const [tags, setTags] = useState<string[]>(value)
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

  useEffect(() => {
    setTags(value)
  }, [value])

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
    <Flex gap="4px 0" wrap>
      {tags.map<React.ReactNode>((tag, index) => {
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
          <Tag key={tag} closable style={{ userSelect: 'none' }} onClose={() => handleClose(tag)}>
            <span
              onDoubleClick={e => {
                setEditInputIndex(index)
                setEditInputValue(tag)
                e.preventDefault()
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        )
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
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
        <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
          添加
        </Tag>
      )}
    </Flex>
  )
})
