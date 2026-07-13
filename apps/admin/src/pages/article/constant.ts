import { BasicStatus } from '@ying/shared'
import { CreateArticleDto } from '@ying/dto'

export const defaultValues: CreateArticleDto = {
  name: undefined,
  title: undefined,
  keywords: undefined,
  coverId: undefined,
  status: BasicStatus.ENABLE
}
