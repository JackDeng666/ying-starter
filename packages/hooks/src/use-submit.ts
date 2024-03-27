import { useState } from 'react'

type TCallback = () => Promise<any>
type TSubmitFn = (callFn: TCallback) => () => Promise<void>

export const useSubmit = (): [boolean, TSubmitFn] => {
  const [loading, setLoading] = useState(false)

  const submitFn: TSubmitFn = callFn => {
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
