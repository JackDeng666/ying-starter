import { Divider, MenuProps, Dropdown, DropdownProps } from 'antd'
import React, { HTMLAttributes, useState } from 'react'

import { IconButton } from '@/components/icon'
import { useUserInfo, logout } from '@/store/userStore'
import { useThemeToken } from '@/hooks'
import { UserInfoModal, UserInfoModalProps } from './user-info-modal'

export default function AccountDropdown() {
  const { name, email, account, avatar } = useUserInfo() ?? {}

  const [userInfoModalProps, setUserInfoModalProps] = useState<UserInfoModalProps>({
    title: '',
    show: false,
    onCancel: () => {
      setUserInfoModalProps(prev => ({ ...prev, show: false }))
    }
  })

  const openUserInfo = () => {
    setUserInfoModalProps(prev => ({
      ...prev,
      show: true,
      title: '修改信息',
      formValue: {
        oldPass: '',
        newPass: ''
      }
    }))
  }

  const { colorBgElevated, borderRadius, boxShadowSecondary } = useThemeToken()

  const contentStyle: React.CSSProperties = {
    width: 150,
    backgroundColor: colorBgElevated,
    borderRadius: borderRadius,
    boxShadow: boxShadowSecondary
  }

  const popupRender: DropdownProps['popupRender'] = menu => (
    <div style={contentStyle}>
      <div className="flex flex-col items-start p-2">
        <span className="w-full text-md text-ellipsis overflow-hidden whitespace-nowrap">{name}</span>
        <span className="w-full text-md text-ellipsis overflow-hidden whitespace-nowrap">{account}</span>
        <span className="w-full text-md text-ellipsis overflow-hidden whitespace-nowrap">{email}</span>
      </div>
      <Divider style={{ margin: 0 }} />
      {React.cloneElement(
        menu as React.ReactElement<{
          style: React.CSSProperties
        }>,
        { style: { boxShadow: 'none' } }
      )}
    </div>
  )

  const items: MenuProps['items'] = [
    {
      label: '修改信息',
      key: '1',
      onClick: openUserInfo
    },
    {
      label: '退出登录',
      danger: true,
      key: '2',
      onClick: logout
    }
  ]

  return (
    <>
      <Dropdown className="shrink-0" menu={{ items }} trigger={['click']} popupRender={popupRender}>
        <img
          className="h-9 w-9 border-border/50 hover:border-border border-2 rounded-full object-cover cursor-pointer"
          src={avatar?.url}
          alt="avatar"
        />
      </Dropdown>
      <UserInfoModal {...userInfoModalProps} />
    </>
  )
}
