import { IsArray, IsOptional } from 'class-validator'
import { ListDto } from './list.dto'

export class ListUserDto extends ListDto {
  @IsOptional()
  name?: string

  @IsOptional()
  email?: string

  @IsOptional()
  @IsArray()
  date?: string[]
}
