import { IsOptional } from 'class-validator'
import { ListDto } from './list.dto'

export class ListUserDto extends ListDto {
  @IsOptional()
  name?: string

  @IsOptional()
  email?: string
}

export enum UserStatType {
  register = '注册',
  google = 'Google',
  github = 'Github',
  facebook = 'Facebook'
}

export class UserStatVo {
  categories: string[]
  list: number[]
}

export class UserStatByTypeVo {
  categories: string[]
  types: {
    name: UserStatType
    data: number[]
  }[]
}
