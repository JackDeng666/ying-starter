import { SetMetadata } from '@nestjs/common'

export const ADMIN_SCOPE = 'admin_scope'
export const CLIENT_SCOPE = 'client_scope'

export const AdminScope = () => SetMetadata(ADMIN_SCOPE, true)
export const ClientScope = () => SetMetadata(CLIENT_SCOPE, true)
