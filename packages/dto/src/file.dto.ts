import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { FileSourceType, FileType } from '@ying/shared'
import { ListDto } from './list.dto'

export class ListFileDto extends ListDto {
  @IsEnum(FileType)
  @IsOptional()
  type?: FileType

  @IsEnum(FileSourceType)
  @IsOptional()
  from?: FileSourceType

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isExternal?: boolean
}
