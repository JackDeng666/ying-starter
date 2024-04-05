import { SuccessIcon } from './icons'

interface FormSuccessProps {
  message?: string
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null

  return (
    <div className="bg-emerald-500/15 p-3 rounded-xl flex items-center gap-x-2 text-sm text-emerald-500">
      <SuccessIcon className="text-xl" />
      <p>{message}</p>
    </div>
  )
}
