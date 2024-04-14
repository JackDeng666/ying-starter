import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigType } from '@nestjs/config'
import { authConfig } from '@/server/config'
import { AccountEntity, FileEntity, UserEntity } from '@ying/shared/entities'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { LocalStrategy } from './strategy/local.strategy'
import { JwtStrategy } from './strategy/jwt.strategy'
import { GithubStrategy } from './strategy/github.strategy'
import { GoogleStrategy } from './strategy/google.strategy'
import { FacebookStrategy } from './strategy/facebook.strategy'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AccountEntity, FileEntity]),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory(authConf: ConfigType<typeof authConfig>) {
        return {
          secret: authConf.secret,
          signOptions: {
            expiresIn: authConf.expiresIn
          }
        }
      },
      inject: [authConfig.KEY]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GithubStrategy, GoogleStrategy, FacebookStrategy]
})
export class AuthModule {}
