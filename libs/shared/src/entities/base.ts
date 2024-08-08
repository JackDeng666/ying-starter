import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { nanoid } from 'nanoid'

@Entity()
export class BaseEntity {
  id: string | number

  @CreateDateColumn({
    type: 'datetime'
  })
  createAt: Date

  @UpdateDateColumn({
    type: 'datetime'
  })
  updateAt: Date

  @DeleteDateColumn({
    type: 'datetime'
  })
  deletedAt: Date
}

@Entity()
export class BaseEntityWithAutoId extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number
}

@Entity()
export class BaseEntityWithNanoID extends BaseEntity {
  @PrimaryColumn('varchar', { length: 20 })
  id = nanoid(20)
}
