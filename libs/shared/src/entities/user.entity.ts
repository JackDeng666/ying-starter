import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import { BaseEntityWithAutoId } from './base'
import { FileEntity } from './file.entity'
import { AccountEntity } from './account.entity'
import { VisitorEntity } from './visitor.entity'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntityWithAutoId {
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

  @OneToMany(() => VisitorEntity, visitor => visitor.user)
  visitors: VisitorEntity[]
}
