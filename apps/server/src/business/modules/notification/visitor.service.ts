import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'

import { CreateVisitorDto, ListVisitorDto, NoticeSubscribeDto } from '@ying/shared'
import { VisitorEntity } from '@ying/shared/entities'

import { BaseService } from '@/server/common/service/base.service'

@Injectable()
export class VisitorService extends BaseService<VisitorEntity> {
  constructor(
    @InjectRepository(VisitorEntity)
    readonly visitorRepository: Repository<VisitorEntity>
  ) {
    super(visitorRepository)
  }

  async createVisitor(dto: CreateVisitorDto) {
    const existVisitor = await this.visitorRepository.findOne({
      where: {
        id: dto.visitorId
      }
    })
    if (existVisitor) {
      existVisitor.language = dto.language
      existVisitor.userAgent = dto.userAgent
      existVisitor.deviceType = dto.deviceType
      return this.visitorRepository.save(existVisitor)
    } else {
      return this.visitorRepository.save(this.visitorRepository.create({ id: dto.visitorId, ...dto }))
    }
  }

  subscribe(dto: NoticeSubscribeDto) {
    return this.visitorRepository.update({ id: dto.visitorId }, { pushSubscription: dto.pushSubscription })
  }

  async bindUser(id: string, userId: number) {
    const visitor = await this.visitorRepository.findOne({
      where: { id }
    })
    visitor.userId = userId
    return this.visitorRepository.save(visitor)
  }

  buildListQuery(dto: ListVisitorDto) {
    const listQuery = super.buildListQuery(dto)
    const { language, deviceType, userId } = dto
    Object.assign(listQuery.where, {
      language: language ? Like(`%${language}%`) : undefined,
      deviceType: deviceType ? Like(`%${deviceType}%`) : undefined,
      userId
    })
    return listQuery
  }

  list(dto: ListVisitorDto) {
    const { where, take, skip } = this.buildListQuery(dto)

    return this.visitorRepository.find({
      where,
      skip,
      take,
      order: {
        createAt: 'DESC'
      },
      relations: {
        user: true
      }
    })
  }

  listCount(dto: ListVisitorDto) {
    const { where } = this.buildListQuery(dto)

    return this.visitorRepository.countBy(where)
  }
}
