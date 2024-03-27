import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SysUserEntity, UserEntity } from '@/shared/entities'
import { SysSettingController } from './setting.controller'
import { SysSettingService } from './setting.service'

@Module({
  imports: [TypeOrmModule.forFeature([SysUserEntity, UserEntity])],
  controllers: [SysSettingController],
  providers: [SysSettingService]
})
export class SysSettingModule {}
