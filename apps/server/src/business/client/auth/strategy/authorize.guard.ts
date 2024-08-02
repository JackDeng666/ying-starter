import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LOCAL_STRATEGY } from './local.strategy'
import { GITHUB_STRATEGY } from './github.strategy'
import { FACEBOOK_STRATEGY } from './facebook.strategy'
import { GOOGLE_STRATEGY } from './google.strategy'

@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL_STRATEGY) {}

@Injectable()
export class GitHubAuthGuard extends AuthGuard(GITHUB_STRATEGY) {}

@Injectable()
export class GoogleAuthGuard extends AuthGuard(GOOGLE_STRATEGY) {}

@Injectable()
export class FaceBookAuthGuard extends AuthGuard(FACEBOOK_STRATEGY) {}
