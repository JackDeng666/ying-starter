import { createClientOnlyFn } from '@tanstack/react-start'
import VConsole from 'vconsole'

export const initVconsole = createClientOnlyFn(() => {
  new VConsole()
})
