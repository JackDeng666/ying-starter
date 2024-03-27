import {
  IsArray,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf
} from 'class-validator'
import { Transform } from 'class-transformer'
import { BasicStatus } from '../../enum'
import { ListDto } from './list.dto'

export class ListSysUserDto extends ListDto {
  @IsOptional()
  name?: string

  @IsOptional()
  account?: string

  @Transform(value => {
    if (value.value === undefined) return undefined
    return Number(value.value)
  })
  @IsOptional()
  @IsEnum(BasicStatus)
  status?: BasicStatus

  @IsOptional()
  @IsArray()
  date?: string[]
}

export class CreateSysUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(2)
  name: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(6)
  account: string

  @ValidateIf(e => e.email !== '')
  @IsOptional()
  @IsEmail()
  email?: string

  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `password must contain digits, lowercase letters, uppercase letters, and special symbols[!@#$%^&*;',.]`
  })
  password: string

  @IsEnum(BasicStatus)
  status: BasicStatus

  @IsOptional()
  @MaxLength(200)
  remark?: string

  @IsArray()
  roleIds: number[]
}

export class UpdateSysUserDto extends CreateSysUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsEmpty()
  password: string
}

export class UpdateSysUserPasswordDto {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `password must contain digits, lowercase letters, uppercase letters, and special symbols[!@#$%^&*;',.]`
  })
  password: string
}

export class UpdateSysUserSelfUserInfoDto {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsNumber()
  avatarId: number
}

export class UpdateSysUserSelfPasswordDto {
  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `password must contain digits, lowercase letters, uppercase letters, and special symbols[!@#$%^&*;',.]`
  })
  oldPass: string

  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*;',.])/, {
    message: `password must contain digits, lowercase letters, uppercase letters, and special symbols[!@#$%^&*;',.]`
  })
  newPass: string
}
