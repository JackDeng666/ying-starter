import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntityWithAutoId } from './base'
import { PushTaskEntity } from './push.task.entity'
import { PushRecordStatus } from '../enum'

@Entity({ name: 'push_record' })
export class PushRecordEntity extends BaseEntityWithAutoId {
  @Column({
    type: 'text'
  })
  pushSubscription: string

  @Column({
    type: 'text'
  })
  pushTemplate: string

  @Column({
    type: 'text',
    nullable: true
  })
  pushResult?: string

  @Column({
    type: 'tinyint',
    default: 0
  })
  clicked: number

  @Column({
    type: 'tinyint',
    default: PushRecordStatus.Pushing
  })
  status: PushRecordStatus

  @Column()
  pushTaskId: number

  @ManyToOne(() => PushTaskEntity, { onDelete: 'CASCADE' })
  pushTask: PushTaskEntity

  @Column()
  visitorId: string
}
