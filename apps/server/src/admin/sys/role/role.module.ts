import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SysRoleEntity, SysUserEntity } from '@ying/shared/entities'
import { SysRoleService } from './role.service'
import { SysRoleController } from './role.controller'

@Module({
  imports: [TypeOrmModule.forFeature([SysRoleEntity, SysUserEntity])],
  controllers: [SysRoleController],
  providers: [SysRoleService]
})
export class SysRoleModule {}
