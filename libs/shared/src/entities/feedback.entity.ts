import { Column, Entity } from 'typeorm'
import { BaseEntity } from './base'

@Entity({ name: 'feedback' })
export class FeedbackEntity extends BaseEntity {
  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  email: string

  @Column()
  content: string
}
