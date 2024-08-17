import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntityWithAutoId } from './base'
import { PushActionDto } from '../dto'
import { FileEntity } from './file.entity'

@Entity({ name: 'push_template' })
export class PushTemplateEntity extends BaseEntityWithAutoId {
  @Column()
  name: string

  @Column()
  title: string

  @Column({
    nullable: true
  })
  link?: string

  @Column({
    nullable: true
  })
  body?: string

  @Column({
    nullable: true
  })
  imageId?: number

  @ManyToOne(() => FileEntity)
  @JoinColumn()
  image?: FileEntity

  @Column({
    type: 'simple-json',
    nullable: true
  })
  actions?: PushActionDto[]
}
