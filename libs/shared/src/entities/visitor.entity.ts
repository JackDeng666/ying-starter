import { Column, Entity, ManyToOne } from 'typeorm'
import type { PushSubscription } from 'web-push'
import { BaseEntity } from './base'
import { UserEntity } from './user.entity'

@Entity({ name: 'visitor' })
export class VisitorEntity extends BaseEntity {
  @Column({
    primary: true
  })
  id: string

  @Column({
    nullable: true
  })
  language?: string

  @Column({
    nullable: true
  })
  userAgent?: string

  @Column({
    nullable: true
  })
  deviceType?: string

  @Column({
    type: 'simple-json',
    nullable: true
  })
  pushSubscription?: PushSubscription

  @Column({
    nullable: true
  })
  userId?: number

  @ManyToOne(() => UserEntity, user => user.visitors)
  user?: UserEntity
}
