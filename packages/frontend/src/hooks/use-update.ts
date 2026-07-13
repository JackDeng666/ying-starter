import { useCallback, useState } from 'react'

export const useUpdate = () => {
  const [, updateState] = useState({})
  const forceUpdate = useCallback(() => updateState({}), [])

  return forceUpdate
}
