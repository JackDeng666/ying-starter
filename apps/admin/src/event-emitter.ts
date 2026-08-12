import mitt from 'mitt'

export type Events = {
  API_ERROR_MSG: string
}

export const globalEvent = mitt<Events>()
