import { useState } from 'react'

type TCallback<T> = () => Promise<T>
type TSubmitFn<T> = (callFn: TCallback<T>) => () => Promise<void>

export const useSubmit = <T>(): [boolean, TSubmitFn<T>] => {
  const [loading, setLoading] = useState(false)

  const submitFn: TSubmitFn<T> = callFn => {
    return async () => {
      try {
        setLoading(true)
        await callFn()
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
  }

  return [loading, submitFn]
}
