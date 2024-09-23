import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntityWithAutoId } from './base'
import { PushActionDto } from '../dto'
import { FileEntity } from './file.entity'
import type { TIntlText } from '../config'

@Entity({ name: 'push_template' })
export class PushTemplateEntity extends BaseEntityWithAutoId {
  @Column()
  name: string

  @Column({
    type: 'json'
  })
  title: TIntlText

  @Column({
    nullable: true
  })
  link?: string

  @Column({
    type: 'json',
    nullable: true
  })
  body?: TIntlText

  @Column({
    nullable: true
  })
  imageId?: number

  @ManyToOne(() => FileEntity)
  @JoinColumn()
  image?: FileEntity

  @Column({
    type: 'json',
    nullable: true
  })
  actions?: PushActionDto[]
}
