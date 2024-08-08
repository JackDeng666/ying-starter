import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { DeviceType, RegisterType } from '@ying/shared/enum'
import { ListDto } from './list.dto'

export class ListVisitorDto extends ListDto {
  @IsOptional()
  language?: string

  @IsEnum(DeviceType)
  @IsOptional()
  deviceType?: DeviceType

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  userId?: number
}

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  visitorId: string

  @IsNumber()
  @IsNotEmpty()
  pushTemplateId: number
}

export class PushActionDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  link?: string
}

export class CreatePushTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  link?: string

  @IsString()
  @IsOptional()
  body?: string

  @IsNumber()
  @IsOptional()
  imageId?: number

  @ValidateNested({ each: true })
  @Type(() => PushActionDto)
  actions?: PushActionDto[]
}

export class UpdatePushTemplateDto extends CreatePushTemplateDto {
  @IsNumber()
  @IsNotEmpty()
  id: number
}

export class ListPushTemplateDto extends ListDto {
  @IsOptional()
  name?: string

  @IsOptional()
  title?: string
}

export class CreatePushTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(RegisterType)
  registerType: RegisterType

  @IsEnum(DeviceType)
  deviceType: DeviceType

  @IsNumber()
  @IsNotEmpty()
  pushTemplateId: number
}

export class UpdatePushTaskDto extends CreatePushTaskDto {
  @IsNumber()
  @IsNotEmpty()
  id: number
}

export class ListPushTaskDto extends ListDto {
  @IsOptional()
  name?: string
}

export class SetPushTaskDto {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsString()
  @IsOptional()
  time?: string
}

export class ListPushRecordDto extends ListDto {
  @IsString()
  @IsOptional()
  visitorId?: string

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  pushTaskId?: number

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  status?: number
}
