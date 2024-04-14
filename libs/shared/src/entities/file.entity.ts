import { Column, Entity } from 'typeorm'
import { FileType, FileSourceType } from '../enum'
import { BaseEntity } from './base.entity'

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: FileType
  })
  type: FileType

  @Column({
    type: 'enum',
    enum: FileSourceType
  })
  from: FileSourceType

  @Column()
  userId: number

  @Column({
    unique: true
  })
  path: string

  @Column({
    length: 2083
  })
  url: string
}
