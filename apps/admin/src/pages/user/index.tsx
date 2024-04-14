import { Card } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect } from 'react'
import dayjs from 'dayjs'

import { debounce } from '@ying/utils'

import { ListUserDto } from '@ying/shared'
import { UserEntity } from '@ying/shared/entities'

import ProTag from '@/admin/theme/antd/components/tag'
// import { useThemeToken } from '@/admin/theme/hooks'
import { usePage } from '@/admin/hooks/use-page'
import { userApi } from '@/admin/api'

import { PageQuery } from './page-query'

export default function UserPage() {
  const { control, watch, reset, getValues } = useForm<ListUserDto>()

  const { list, listLoading, pagination, reload } = usePage({
    listApi: useCallback(
      ({ page, size }) =>
        userApi.list({
          ...getValues(),
          page,
          size
        }),
      [getValues]
    ),
    listCount: useCallback(
      () =>
        userApi.listCount({
          ...getValues()
        }),
      [getValues]
    )
  })

  useEffect(() => {
    const subscription = watch(debounce(reload, 500))
    return () => subscription.unsubscribe()
  }, [watch, reload])

  // const { colorTextSecondary } = useThemeToken()
  const columns: ColumnsType<UserEntity> = [
    {
      title: 'ID',
      width: 100,
      align: 'center',
      dataIndex: 'id'
    },
    {
      title: '昵称',
      width: 120,
      ellipsis: true,
      dataIndex: 'name'
    },
    {
      title: '头像',
      width: 100,
      align: 'center',
      render: (_, record) => {
        return (
          <div className="inline-block h-10 w-10 rounded-full overflow-hidden shadow-md">
            {record.avatar?.url && <img alt="avatar" src={record.avatar.url} className="object-cover" />}
          </div>
        )
      }
    },
    {
      title: '邮箱',
      width: 200,
      ellipsis: true,
      dataIndex: 'email'
    },
    // {
    //   title: '用户',
    //   width: 240,
    //   render: (_, record) => {
    //     return (
    //       <div className="flex">
    //         <img
    //           alt=""
    //           src={record.avatar.url}
    //           className="h-10 w-10 rounded-full"
    //         />
    //         <div className="ml-2 flex flex-col">
    //           <span className="text-sm">{record.name}</span>
    //           <span style={{ color: colorTextSecondary }} className="text-xs">
    //             {record.email}
    //           </span>
    //         </div>
    //       </div>
    //     )
    //   }
    // },
    {
      title: '邮箱状态',
      dataIndex: 'role',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <ProTag color={record.emailVerified ? 'cyan' : 'warning'}>{record.emailVerified ? '已验证' : '未验证'}</ProTag>
      )
    },
    {
      title: '来源',
      dataIndex: 'account',
      render: (_, record) => <div>{record.account?.provider ? record.account?.provider : '注册'}</div>
    },
    {
      title: '三方账号ID',
      dataIndex: 'account',
      render: (_, record) => <div>{record.account?.providerAccountId}</div>
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      width: 160,
      render: (_, record) => <div>{dayjs(record.createAt).format('YYYY-MM-DD HH:mm:ss')}</div>
    }
  ]

  return (
    <Card bordered={false} styles={{ body: { paddingBottom: 0 } }}>
      <PageQuery control={control} reset={reset} />

      <Table
        rowKey="id"
        scroll={{ x: 1000, y: 500 }}
        loading={listLoading}
        pagination={pagination}
        columns={columns}
        dataSource={list}
      />
    </Card>
  )
}
