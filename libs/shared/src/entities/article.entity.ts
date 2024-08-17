import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntityWithAutoId } from './base'
import { BasicStatus } from '../enum'
import { FileEntity } from './file.entity'

@Entity({ name: 'article' })
export class ArticleEntity extends BaseEntityWithAutoId {
  @Column()
  name: string

  @Column()
  title: string

  @Column({
    nullable: true,
    type: 'simple-array'
  })
  keywords?: string[]

  @Column({
    type: 'text',
    nullable: true
  })
  content?: string

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
