import { useCallback, useState } from 'react'

type UseDialogOpenProps = {
  defaultOpen?: boolean
}

export const useDialogOpen = (props: UseDialogOpenProps = {}) => {
  const { defaultOpen = false } = props
  const [open, setOpen] = useState(defaultOpen)

  const onOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  const onOpenChange = useCallback((val: boolean) => {
    setOpen(val)
  }, [])

  return {
    open,
    onOpen,
    onClose,
    onOpenChange
  }
}
