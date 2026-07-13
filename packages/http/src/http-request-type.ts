import { StrictOmit } from './type'

export type ResponseDataTypeMap = {
  json: any
  raw: Response
  blob: Blob
  text: string
  arrayBuffer: ArrayBuffer
  bytes: Uint8Array
}
export type ResponseDataTypeAll = keyof ResponseDataTypeMap
export type ResponseDataType = Exclude<ResponseDataTypeAll, 'json'>

export type RequestOptions = {
  url: string
  method: 'get' | 'post' | 'put' | 'delete'
  query?: object
  data?: object
  headers?: Record<string, string>
  body?: BodyInit
  responseType?: ResponseDataTypeAll
  additional?: Record<string, any>
  skipBeforeRequest?: boolean
  skipAfterResponse?: boolean
  skipBeforeError?: boolean
  skipAfterError?: boolean
}
export type RequestOptionsWithSpecialResponseType<T extends ResponseDataType> = RequestOptions & { responseType: T }
export type RequestOptionsWithJSONResponseType = RequestOptions & { responseType?: 'json' }

export type MethodOptions = StrictOmit<RequestOptions, 'url' | 'method'>
export type MethodOptionsWithSpecialResponseType<T extends ResponseDataType> = MethodOptions & { responseType: T }
export type MethodOptionsWithJSONResponseType = MethodOptions & { responseType?: 'json' }
