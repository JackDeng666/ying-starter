import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigType } from '@nestjs/config'
import { dbConfig } from '@/config'
import { DbSeeder } from './db.seeder'
import { SysPermissionEntity, SysRoleEntity, SysUserEntity } from '@/shared/entities'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (dbConf: ConfigType<typeof dbConfig>) => {
        return {
          charset: 'utf8mb4',
          type: 'mysql',
          host: dbConf.host,
          port: dbConf.port,
          username: dbConf.username,
          password: dbConf.password,
          database: dbConf.database,
          synchronize: process.env.NODE_ENV === 'dev',
          autoLoadEntities: true,
          logging: false
        }
      },
      inject: [dbConfig.KEY]
    }),
    TypeOrmModule.forFeature([SysPermissionEntity, SysUserEntity, SysRoleEntity])
  ],
  providers: [DbSeeder]
})
export class DbModule {}
