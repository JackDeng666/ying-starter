import { createLogger, type UserConfig } from 'vite'

const logger = createLogger()

export const customLogger: UserConfig['customLogger'] = {
  ...logger,
  info(msg, opts) {
    if (msg.includes('http://localhost')) {
      msg = msg.replace('localhost', 'client.localhost')
    }
    logger.info(msg, opts)
  }
}
