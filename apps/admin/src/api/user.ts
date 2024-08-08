import { ListUserDto, StatDto, UserStatByTypeVo, UserStatVo } from '@ying/shared'
import { UserEntity } from '@ying/shared/entities'
import { request, timeDataTransform } from './request'

export function list(params: ListUserDto): Promise<UserEntity[]> {
  return request.get('/user/list', { params: timeDataTransform(params, 'date') })
}

export function listCount(params: ListUserDto): Promise<number> {
  return request.get('/user/list-count', { params: timeDataTransform(params, 'date') })
}

export function getUserGrowthTotal(): Promise<number> {
  return request.get('/user-stat/growth-total')
}

export function getUserGrowthTrendAll(params: StatDto): Promise<UserStatVo> {
  return request.get('/user-stat/growth-trend-all', { params })
}

export function getUserGrowthTrend(params: StatDto): Promise<UserStatByTypeVo> {
  return request.get('/user-stat/growth-trend', { params })
}
