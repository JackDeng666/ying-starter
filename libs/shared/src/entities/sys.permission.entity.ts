import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { SysRoleEntity } from './sys.role.entity'
import { BaseEntity } from './base'

@Entity('sys_permission')
export class SysPermissionEntity extends BaseEntity {
  @Column({
    nullable: true
  })
  sortId?: number

  @Column()
  label: string

  @PrimaryColumn()
  code: string

  @Column({
    nullable: true
  })
  parentCode?: string

  @ManyToOne(() => SysPermissionEntity, sysPermission => sysPermission.children, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'parentCode', referencedColumnName: 'code' })
  parent?: SysPermissionEntity

  @OneToMany(() => SysPermissionEntity, sysPermission => sysPermission.parent)
  children: SysPermissionEntity[]

  @ManyToMany(() => SysRoleEntity, role => role.permissions)
  @JoinTable({ name: 'sys_permissions_roles' })
  roles: SysRoleEntity[]
}
