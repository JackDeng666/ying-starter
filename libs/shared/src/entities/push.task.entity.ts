import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntityWithAutoId } from './base'
import { RegisterType, DeviceType, PushTaskStatus } from '../enum'
import { PushTemplateEntity } from './push.template.entity'

export type TaskStatus = {
  pushing: number
  success: number
  fail: number
  click: number
}

@Entity({ name: 'push_task' })
export class PushTaskEntity extends BaseEntityWithAutoId {
  @Column()
  name: string

  @Column({
    type: 'datetime',
    nullable: true
  })
  time?: string

  @Column({
    type: 'enum',
    enum: RegisterType
  })
  registerType: RegisterType

  @Column({
    type: 'enum',
    enum: DeviceType
  })
  deviceType: DeviceType

  @Column()
  pushTemplateId: number

  @ManyToOne(() => PushTemplateEntity)
  pushTemplate: PushTemplateEntity

  @Column({
    type: 'tinyint',
    default: PushTaskStatus.Wait
  })
  status: PushTaskStatus

  taskStatus?: TaskStatus
}
