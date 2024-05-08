import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from 'typeorm'
import { BasicStatus, PermissionType } from '../enum'
import { SysRoleEntity } from './sys.role.entity'

@Entity('sys_permission')
export class SysPermissionEntity {
  @Column({
    nullable: true
  })
  sortId?: number

  @PrimaryColumn()
  code: string

  @Column({
    nullable: true
  })
  parentCode?: string

  @ManyToOne(() => SysPermissionEntity, sysPermission => sysPermission.children, { nullable: true })
  @JoinColumn({ name: 'parentCode', referencedColumnName: 'code' })
  parent?: SysPermissionEntity

  @OneToMany(() => SysPermissionEntity, sysPermission => sysPermission.parent)
  children: SysPermissionEntity[]

  @Column()
  label: string

  @Column({
    nullable: true
  })
  icon: string

  @Column({
    type: 'enum',
    enum: PermissionType
  })
  type: PermissionType

  @Column({
    nullable: true
  })
  route?: string

  @Column({
    nullable: true
  })
  component?: string

  @Column({
    default: false
  })
  hideMenu: boolean

  @Column({
    type: 'enum',
    enum: BasicStatus,
    default: BasicStatus.ENABLE
  })
  status: BasicStatus

  @Column({
    default: 0
  })
  sort: number

  @Column({
    nullable: true
  })
  frameSrc?: string

  @Column({
    default: false
  })
  noCache: boolean

  @Column({
    nullable: true
  })
  remark?: string

  @CreateDateColumn()
  createAt: Date

  @ManyToMany(() => SysRoleEntity, role => role.permissions)
  @JoinTable({ name: 'sys_permissions_roles' })
  roles: SysRoleEntity[]
}
