import { EventEmitter } from 'events'

type TGlobalEvent = {
  API_ERROR_MSG: [string | string[]]
}

const globalEvent = new EventEmitter<TGlobalEvent>()

export { globalEvent }
