import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'

export class CreateVisitorDto {
  @IsString()
  visitorId: string

  @IsString()
  @IsOptional()
  language?: string

  @IsString()
  @IsOptional()
  userAgent?: string

  @IsString()
  @IsOptional()
  deviceType?: string
}

class KeysDto {
  @IsString()
  @IsNotEmpty()
  p256dh: string

  @IsString()
  @IsNotEmpty()
  auth: string
}

class SubscriptionDto {
  @IsString()
  @IsNotEmpty()
  endpoint: string

  @ValidateNested()
  @Type(() => KeysDto)
  keys: KeysDto
}

export class NoticeSubscribeDto {
  @IsString()
  @IsNotEmpty()
  visitorId: string

  @ValidateNested()
  @Type(() => SubscriptionDto)
  @IsNotEmpty()
  pushSubscription: SubscriptionDto
}
