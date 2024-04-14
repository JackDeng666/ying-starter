import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator'
import { BasicStatus, PermissionType } from '../../enum'

export class CreateOrUpdatePermissionDto {
  @IsString()
  @MaxLength(128)
  code: string

  @IsOptional()
  @IsString()
  parentCode: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  label: string

  @IsOptional()
  @IsString()
  @MaxLength(128)
  icon?: string

  @IsEnum(PermissionType)
  type: PermissionType

  @IsEnum(BasicStatus)
  status: BasicStatus

  @ValidateIf(o => o.type !== PermissionType.BUTTON)
  @MaxLength(128)
  @IsString()
  @IsNotEmpty()
  route?: string

  @ValidateIf(o => o.type === PermissionType.MENU)
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  component?: string

  @IsOptional()
  @IsString()
  frameSrc?: string

  @IsBoolean()
  noCache: boolean

  @IsOptional()
  @MaxLength(256)
  remark?: string

  @IsOptional()
  @IsNumber()
  sort?: number
}
