import React from 'react'
import { Dropdown, MenuProps, Popconfirm, Space } from 'antd'

import { IconButton, Iconify } from '@/admin/components/icon'

type PageOperationsProps = {
  extra?: React.ReactNode
  onEdit?: VoidFunction
  editDisabled?: boolean
  deleteTitle?: string
  onDelete?: VoidFunction
  deleteDisabled?: boolean
  ellipsisItems?: MenuProps['items']
}

export const PageOperations = ({
  extra,
  onEdit,
  editDisabled,
  deleteTitle,
  onDelete,
  deleteDisabled,
  ellipsisItems
}: PageOperationsProps) => {
  return (
    <div className="flex w-full justify-center gap-1 text-gray">
      {extra}
      {onEdit && (
        <IconButton onClick={onEdit} disabled={editDisabled}>
          <Iconify icon="solar:pen-bold-duotone" size={18} />
        </IconButton>
      )}
      {onDelete && (
        <Popconfirm
          title={deleteTitle ? deleteTitle : '确定删除？'}
          okText="确定"
          cancelText="取消"
          placement="left"
          onConfirm={onDelete}
        >
          <IconButton disabled={deleteDisabled}>
            <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
          </IconButton>
        </Popconfirm>
      )}
      {ellipsisItems && (
        <Dropdown menu={{ items: ellipsisItems }} trigger={['click']} placement="bottomRight">
          <Space>
            <IconButton>
              <Iconify icon="lucide:ellipsis" size={18} />
            </IconButton>
          </Space>
        </Dropdown>
      )}
    </div>
  )
}
