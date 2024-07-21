import { IsOptional } from 'class-validator'
import { ListDto } from './list.dto'

export class ListFeedbackDto extends ListDto {
  @IsOptional()
  email?: string
}
