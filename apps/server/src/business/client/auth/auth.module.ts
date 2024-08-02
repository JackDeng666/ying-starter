import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AccountEntity, FileEntity, UserEntity } from '@ying/shared/entities'
import { UserModule } from '@/server/business/modules/user/user.module'

import { AuthService } from './auth.service'
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
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GithubStrategy, GoogleStrategy, FacebookStrategy]
})
export class AuthModule {}
