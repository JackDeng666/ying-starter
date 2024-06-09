import { Between, DeepPartial, FindOptionsWhere, FindOptionsWhereProperty, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { ListDto } from '@ying/shared'
import { BaseEntity } from '@ying/shared/entities/base'

export class BaseService<TEntity extends BaseEntity> {
  constructor(readonly repository: Repository<TEntity>) {}

  buildListQuery(dto: ListDto) {
    const { page, size, date } = dto
    const skip = ((page || 1) - 1) * (size || 10)
    const take = size || 10

    const where: FindOptionsWhere<TEntity> = {}

    if (date) {
      const startDate = new Date(date[0])
      const endDate = new Date(date[1])
      where.createAt = Between(startDate, new Date(endDate.setDate(endDate.getDate() + 1))) as FindOptionsWhereProperty<
        NonNullable<TEntity['createAt']>,
        NonNullable<TEntity['createAt']>
      >
    }

    return {
      skip,
      take,
      where
    }
  }

  create(dto: DeepPartial<TEntity>) {
    return this.repository.save(this.repository.create(dto))
  }

  updateById(id: number, dto: QueryDeepPartialEntity<TEntity>) {
    return this.repository.update(id, dto)
  }

  delete(id: number) {
    this.repository.delete(id)
  }

  softDelete(id: number) {
    this.repository.softDelete(id)
  }
}
