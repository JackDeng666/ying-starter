import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { FileEntity } from './file.entity'
import { AccountEntity } from './account.entity'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  name?: string

  @Column({ type: 'varchar', nullable: true, unique: true })
  email?: string

  @Column({ type: 'boolean' })
  emailVerified: boolean

  @Column({ type: 'varchar', nullable: true })
  password?: string

  @Column({
    nullable: true
  })
  avatarId: number

  @OneToOne(() => FileEntity)
  @JoinColumn()
  avatar?: FileEntity

  @OneToOne(() => AccountEntity, account => account.user)
  account?: AccountEntity
}
