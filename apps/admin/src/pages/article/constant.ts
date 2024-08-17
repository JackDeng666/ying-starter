import { BasicStatus, CreateArticleDto } from '@ying/shared'

export const defaultValues: CreateArticleDto = {
  name: undefined,
  title: undefined,
  keywords: [],
  coverId: undefined,
  content: undefined,
  status: BasicStatus.ENABLE
}
