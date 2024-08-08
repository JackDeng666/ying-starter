import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'

import { CreatePushTaskDto, ListPushTaskDto, PushRecordStatus } from '@ying/shared'
import { PushRecordEntity, PushTaskEntity, TaskStatus } from '@ying/shared/entities'

import { BaseService } from '@/server/common/service/base.service'

@Injectable()
export class PushTaskService extends BaseService<PushTaskEntity> {
  constructor(
    @InjectRepository(PushTaskEntity)
    readonly pushTaskRepository: Repository<PushTaskEntity>,
    @InjectRepository(PushRecordEntity)
    readonly pushRecordRepository: Repository<PushRecordEntity>
  ) {
    super(pushTaskRepository)
  }

  async create(dto: CreatePushTaskDto) {
    return this.pushTaskRepository.save(this.pushTaskRepository.create(dto))
  }

  detail(id: number) {
    return this.pushTaskRepository.findOne({
      where: { id },
      relations: {
        pushTemplate: true
      }
    })
  }

  buildListQuery(dto: ListPushTaskDto) {
    const listQuery = super.buildListQuery(dto)
    const { name } = dto
    Object.assign(listQuery.where, {
      name: name ? Like(`%${name}%`) : undefined
    })
    return listQuery
  }

  async list(dto: ListPushTaskDto) {
    const { where, take, skip } = this.buildListQuery(dto)

    const pushTasks = await this.pushTaskRepository.find({
      where,
      skip,
      take,
      order: {
        createAt: 'DESC'
      },
      relations: {
        pushTemplate: true
      }
    })

    return Promise.all(
      pushTasks.map(async el => {
        const taskStatus: TaskStatus = {
          success: await this.pushRecordRepository.countBy({
            pushTaskId: el.id,
            status: PushRecordStatus.Success
          }),
          fail: await this.pushRecordRepository.countBy({
            pushTaskId: el.id,
            status: PushRecordStatus.Fail
          }),
          pushing: await this.pushRecordRepository.countBy({
            pushTaskId: el.id,
            status: PushRecordStatus.Pushing
          }),
          click: await this.pushRecordRepository.countBy({
            pushTaskId: el.id,
            clicked: 1
          })
        }
        el.taskStatus = taskStatus
        return el
      })
    )
  }

  listCount(dto: ListPushTaskDto) {
    const { where } = this.buildListQuery(dto)
    return this.pushTaskRepository.countBy(where)
  }
}
