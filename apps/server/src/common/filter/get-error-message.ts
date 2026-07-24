import { HttpException } from '@nestjs/common'

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof HttpException || error instanceof Error) {
    return error.message
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }
  return String(error)
}
