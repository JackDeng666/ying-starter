import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { ListDto } from './list.dto'
import { BasicStatus } from '../enum'
import type { TIntlText } from '../config'
import { IsIntlText } from './intl.validator'

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: '名称不能为空' })
  name: string

  @IsIntlText()
  title: TIntlText

  @IsArray()
  @IsOptional()
  keywords?: string[]

  @IsNumber()
  @IsNotEmpty({ message: '封面不能为空' })
  coverId: number

  @IsIntlText({ canEmpty: true })
  content?: TIntlText

  @IsNumber()
  @IsOptional()
  sort?: number

  @IsNumber()
  @IsNotEmpty()
  status?: number
}

export class UpdateArticleDto extends CreateArticleDto {
  @IsNumber()
  @IsNotEmpty()
  id: number
}

export class ListArticleDto extends ListDto {
  @IsOptional()
  @IsString()
  name?: string

  @Transform(value => {
    if (value.value === undefined) return undefined
    return Number(value.value)
  })
  @IsOptional()
  @IsEnum(BasicStatus)
  status?: BasicStatus
}
