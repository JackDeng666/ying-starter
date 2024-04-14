import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm'
import { Exclude, instanceToPlain } from 'class-transformer'
import { BasicStatus } from '../enum'
import { BaseEntity } from './base.entity'
import { SysRoleEntity } from './sys.role.entity'
import { SysPermissionEntity } from './sys.permission.entity'
import { FileEntity } from './file.entity'

@Entity('sys_user')
export class SysUserEntity extends BaseEntity {
  @Column()
  name: string

  @Column({
    unique: true
  })
  account: string

  @Column({
    nullable: true
  })
  email?: string

  @Column()
  @Exclude()
  password: string

  @Column({
    nullable: true
  })
  avatarId: number

  @OneToOne(() => FileEntity)
  @JoinColumn()
  avatar: FileEntity

  @Column({
    type: 'enum',
    enum: BasicStatus,
    default: BasicStatus.ENABLE
  })
  status: BasicStatus

  @Column({
    nullable: true
  })
  remark: string

  @ManyToMany(() => SysRoleEntity, role => role.users, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  roles: SysRoleEntity[]

  permissions?: SysPermissionEntity[]

  toJSON() {
    return instanceToPlain(this)
  }
}
