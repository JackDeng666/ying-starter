import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseEntity } from './base'
import { UserEntity } from './user.entity'

@Entity({ name: 'account' })
export class AccountEntity extends BaseEntity {
  @Column()
  type: string

  @Column()
  provider: string

  @Column()
  providerAccountId: string

  @Column()
  userId: number

  @OneToOne(() => UserEntity, user => user.account)
  @JoinColumn()
  user: UserEntity
}
