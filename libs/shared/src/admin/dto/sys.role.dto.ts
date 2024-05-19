import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { BasicStatus } from '../../enum'
import { ListDto } from './list.dto'

export class ListRoleDto extends ListDto {
  @IsOptional()
  name?: string

  @Transform(value => {
    if (value.value === undefined) return undefined
    return Number(value.value)
  })
  @IsOptional()
  @IsEnum(BasicStatus)
  status?: BasicStatus
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name: string

  @IsEnum(BasicStatus)
  status: BasicStatus

  @IsOptional()
  @MaxLength(200)
  remark?: string

  @IsOptional()
  @IsNumber()
  sort?: number

  @IsArray()
  permissionCodes: string[]
}

export class UpdateRoleDto extends CreateRoleDto {
  @IsNumber()
  @IsNotEmpty()
  id: number
}
