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
  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @DeleteDateColumn()
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
