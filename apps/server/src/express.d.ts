import { TAdminPayload } from '@/server/business/admin/sys/auth/guard'
import { TClientPayload } from '@/server/business/client/auth/strategy/jwt.strategy'

declare global {
  interface MulterFile {
    /** Name of the form field associated with this file. */
    fieldname: string
    /** Name of the file on the uploader's computer. */
    originalname: string
    /**
     * Value of the `Content-Transfer-Encoding` header for this file.
     * @deprecated since July 2015
     * @see RFC 7578, Section 4.7
     */
    encoding: string
    /** Value of the `Content-Type` header for this file. */
    mimetype: string
    /** Size of the file in bytes. */
    size: number
    /**
     * A readable stream of this file. Only available to the `_handleFile`
     * callback for custom `StorageEngine`s.
     */
    stream: Readable
    /** `DiskStorage` only: Directory to which this file has been uploaded. */
    destination: string
    /** `DiskStorage` only: Name of this file within `destination`. */
    filename: string
    /** `DiskStorage` only: Full path to the uploaded file. */
    path: string
    /** `MemoryStorage` only: A Buffer containing the entire file. */
    buffer: Buffer
  }
}

declare module 'express' {
  interface Request {
    token?: string
    user?: TClientPayload | TAdminPayload
  }
}
