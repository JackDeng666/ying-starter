import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseEntityWithAutoId } from './base'
import { UserEntity } from './user.entity'

@Entity({ name: 'account' })
export class AccountEntity extends BaseEntityWithAutoId {
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
