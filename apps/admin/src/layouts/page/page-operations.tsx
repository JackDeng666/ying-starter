import React from 'react'
import { Dropdown, type MenuProps, Popconfirm } from 'antd'

import { IconButton, Iconify } from '@/components/icon'

type PageOperationsProps = {
  extra?: React.ReactNode
  onEdit?: VoidFunction
  editDisabled?: boolean
  deleteTitle?: string
  onDelete?: VoidFunction
  deleteDisabled?: boolean
  ellipsisItems?: MenuProps['items']
  iconSize?: number
}

export const PageOperations = ({
  extra,
  onEdit,
  editDisabled,
  deleteTitle,
  onDelete,
  deleteDisabled,
  ellipsisItems,
  iconSize = 18
}: PageOperationsProps) => {
  return (
    <div className="flex w-full justify-center gap-1 text-gray">
      {extra}
      {onEdit && (
        <IconButton onClick={onEdit} disabled={editDisabled}>
          <Iconify icon="solar:pen-bold-duotone" size={iconSize} />
        </IconButton>
      )}
      {onDelete &&
        (deleteTitle ? (
          <Popconfirm title={deleteTitle} okText="确定" cancelText="取消" placement="left" onConfirm={onDelete}>
            <IconButton disabled={deleteDisabled}>
              <Iconify icon="mingcute:delete-2-fill" size={iconSize} className="text-error" />
            </IconButton>
          </Popconfirm>
        ) : (
          <IconButton disabled={deleteDisabled} onClick={onDelete}>
            <Iconify icon="mingcute:delete-2-fill" size={iconSize} className="text-error" />
          </IconButton>
        ))}
      {ellipsisItems && (
        <Dropdown menu={{ items: ellipsisItems }} trigger={['click']} placement="bottomRight">
          <IconButton>
            <Iconify icon="lucide:ellipsis" size={iconSize} />
          </IconButton>
        </Dropdown>
      )}
    </div>
  )
}
