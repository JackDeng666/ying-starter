import { IsString } from 'class-validator'

export class SettingDto {
  @IsString()
  debugUserIds: string
}
