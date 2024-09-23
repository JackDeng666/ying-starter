import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntityWithAutoId } from './base'
import { BasicStatus } from '../enum'
import { FileEntity } from './file.entity'
import type { TIntlText } from '../config'

@Entity({ name: 'article' })
export class ArticleEntity extends BaseEntityWithAutoId {
  @Column()
  name: string

  @Column({
    type: 'json'
  })
  title: TIntlText

  @Column({
    nullable: true,
    type: 'simple-array'
  })
  keywords?: string[]

  @Column({
    type: 'json',
    nullable: true
  })
  content?: TIntlText

  @Column()
  coverId: number

  @ManyToOne(() => FileEntity)
  @JoinColumn()
  cover: FileEntity

  @Column({
    type: 'tinyint',
    default: BasicStatus.ENABLE
  })
  status: BasicStatus

  @Column({
    default: 0
  })
  sort: number

  @Column({
    default: 0
  })
  view: number
}
