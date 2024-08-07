import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { BasicStatus } from '../enum'
import { BaseEntityWithAutoId } from './base'
import { SysPermissionEntity } from './sys.permission.entity'
import { SysUserEntity } from './sys.user.entity'

@Entity('sys_role')
export class SysRoleEntity extends BaseEntityWithAutoId {
  @Column()
  name: string

  @Column({
    type: 'tinyint',
    default: BasicStatus.ENABLE
  })
  status: BasicStatus

  @Column({ type: 'boolean', default: false })
  systemic: boolean

  @Column({
    nullable: true
  })
  remark: string

  @Column({
    default: 0
  })
  sort: number

  @ManyToMany(() => SysPermissionEntity, permission => permission.roles, {
    onDelete: 'CASCADE'
  })
  permissions: SysPermissionEntity[]

  @ManyToMany(() => SysUserEntity, user => user.roles)
  @JoinTable({ name: 'sys_roles_users' })
  users: SysUserEntity[]
}
