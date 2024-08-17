import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { ListDto } from './list.dto'
import { BasicStatus } from '../enum'

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: '名称不能为空' })
  name: string

  @IsString()
  @MaxLength(32, { message: '长度不能大于32个字符' })
  @MinLength(2, { message: '长度最少2个字符' })
  @IsNotEmpty({ message: '标题不能为空' })
  title: string

  @IsArray()
  @IsOptional()
  keywords?: string[]

  @IsNumber()
  @IsNotEmpty({ message: '封面不能为空' })
  coverId: number

  @IsString()
  @IsOptional()
  content?: string

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
