import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SysUserEntity } from '@ying/shared/entities'
import { SysUserController } from './user.controller'
import { SysUserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([SysUserEntity])],
  controllers: [SysUserController],
  providers: [SysUserService]
})
export class SysUserModule {}
