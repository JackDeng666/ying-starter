import { IsNumber, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class ListDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  size?: number
}
