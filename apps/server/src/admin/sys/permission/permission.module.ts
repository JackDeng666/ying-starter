import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SysPermissionEntity } from '@/shared/entities'
import { SysPermissionService } from './permission.service'
import { SysPermissionController } from './permission.controller'

@Module({
  imports: [TypeOrmModule.forFeature([SysPermissionEntity])],
  controllers: [SysPermissionController],
  providers: [SysPermissionService]
})
export class SysPermissionModule {}
