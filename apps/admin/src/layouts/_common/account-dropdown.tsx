import { Divider, MenuProps, Dropdown, DropdownProps } from 'antd'
import React, { HTMLAttributes, useState } from 'react'

import { IconButton } from '@/components/icon'
import { useUserInfo, logout } from '@/store/userStore'
import { useThemeToken } from '@/theme/hooks'
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

  const { colorBgElevated, borderRadiusLG, boxShadowSecondary } = useThemeToken()

  const contentStyle: React.CSSProperties = {
    width: 150,
    backgroundColor: colorBgElevated,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary
  }

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none'
  }

  const popupRender: DropdownProps['popupRender'] = menu => (
    <div style={contentStyle}>
      <div className="flex flex-col items-start p-2">
        <span className="w-full text-md text-ellipsis overflow-hidden whitespace-nowrap">{name}</span>
        <span className="w-full text-md text-ellipsis overflow-hidden whitespace-nowrap">{account}</span>
        <span className="w-full text-md text-ellipsis overflow-hidden whitespace-nowrap">{email}</span>
      </div>
      <Divider style={{ margin: 0 }} />
      {React.cloneElement<HTMLAttributes<''>>(menu as React.ReactElement, { style: menuStyle })}
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
      <Dropdown className="shrink-0" menu={{ items }} trigger={['click']} popupRender={popupRender}>
        <a onClick={e => e.preventDefault()}>
          <IconButton className="h-10 w-10 transform-none px-0">
            <img className="h-8 w-8 rounded-full object-cover" src={avatar?.url} alt="avatar" />
          </IconButton>
        </a>
      </Dropdown>
      <UserInfoModal {...userInfoModalProps} />
    </>
  )
}
