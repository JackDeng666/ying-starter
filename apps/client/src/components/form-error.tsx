import { ErrorIcon } from './icons'

interface FormErrorProps {
  message?: string
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null

  return (
    <div className="bg-destructive/15 p-3 rounded-xl flex items-center gap-x-2 text-sm text-destructive">
      <ErrorIcon className="text-xl" />
      <p>{message}</p>
    </div>
  )
}
