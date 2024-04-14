import { Divider, MenuProps } from 'antd'
import Dropdown, { DropdownProps } from 'antd/es/dropdown/dropdown'
import React, { useState } from 'react'

import { IconButton } from '@/admin/components/icon'
import { useUserInfo, logout } from '@/admin/store/userStore'
import { useThemeToken } from '@/admin/theme/hooks'
import { UserInfoModal, UserInfoModalProps } from './user-info-modal'

export default function AccountDropdown() {
  const { name, email, account, avatar } = useUserInfo()

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

  const { colorBgElevated, borderRadiusLG, boxShadowSecondary } = useThemeToken()

  const contentStyle: React.CSSProperties = {
    backgroundColor: colorBgElevated,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary
  }

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none'
  }

  const dropdownRender: DropdownProps['dropdownRender'] = menu => (
    <div style={contentStyle}>
      <div className="flex flex-col items-start p-2">
        <span className="text-md">{name}</span>
        <span className="text-sm">{account}</span>
        <span className="text-sm">{email}</span>
      </div>
      <Divider style={{ margin: 0 }} />
      {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
    </div>
  )

  const items: MenuProps['items'] = [
    {
      label: <button className="font-bold">修改信息</button>,
      key: '2',
      onClick: openUserInfo
    },
    {
      type: 'divider'
    },
    {
      label: <button className="font-bold text-warning">退出登录</button>,
      key: '3',
      onClick: logout
    }
  ]

  return (
    <>
      <Dropdown menu={{ items }} trigger={['click']} dropdownRender={dropdownRender}>
        <IconButton className="h-10 w-10 transform-none px-0 hover:scale-105">
          <img className="h-8 w-8 rounded-full object-cover" src={avatar?.url} alt="avatar" />
        </IconButton>
      </Dropdown>
      <UserInfoModal {...userInfoModalProps} />
    </>
  )
}
