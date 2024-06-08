import { IsEnum, IsOptional } from 'class-validator'
import { FileSourceType, FileType } from '../../enum'
import { ListDto } from './list.dto'

export class ListFileDto extends ListDto {
  @IsOptional()
  @IsEnum(FileType)
  type?: FileType

  @IsOptional()
  @IsEnum(FileSourceType)
  from?: FileSourceType
}
