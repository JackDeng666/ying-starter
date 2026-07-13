import dayjs from 'dayjs'

export type OperationLogType = 'default' | 'success' | 'error' | 'warn' | 'event'

export type OperationLogData<TExtra = unknown> = {
  time: string
  type: OperationLogType
  text: string
  extra?: TExtra
}

export class OperationLog {
  static getLogData<TExtra>(
    text: string,
    type: OperationLogType = 'default',
    extra?: TExtra
  ): OperationLogData<TExtra> {
    return {
      time: dayjs().format('HH:mm:ss.SSS'),
      text,
      type,
      extra
    }
  }
  static default<TExtra>(text: string, extra?: TExtra) {
    return this.getLogData(text, 'default', extra)
  }
  static success<TExtra>(text: string, extra?: TExtra) {
    return this.getLogData(text, 'success', extra)
  }
  static error<TExtra>(text: string, extra?: TExtra) {
    return this.getLogData(text, 'error', extra)
  }
  static warn<TExtra>(text: string, extra?: TExtra) {
    return this.getLogData(text, 'warn', extra)
  }
  static event<TExtra>(extra?: TExtra) {
    return this.getLogData('event', 'event', extra)
  }
}

export type OnOperationLogFn<TExtra = unknown> = (logData: OperationLogData<TExtra>) => void
