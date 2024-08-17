import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator'

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

export class ResetPasswordDto {
  @IsOptional()
  oldPassword: string

  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: 'Incorrect password format'
  })
  @IsNotEmpty({
    message: 'validation.new_password_should_not_be_empty'
  })
  newPassword: string
}

export class UpdateUserInfoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: 'validation.nickname_should_not_be_empty'
  })
  name: string

  @IsOptional()
  @IsNumber()
  avatarId: number
}
