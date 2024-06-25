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
export class BaseEntityWithoutId {
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
export class BaseEntity extends BaseEntityWithoutId {
  @PrimaryGeneratedColumn()
  id: number
}

@Entity()
export class BaseEntityWithNanoID extends BaseEntityWithoutId {
  @PrimaryColumn('varchar', { length: 20 })
  id = nanoid(20)
}
