import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import type { PushSubscription } from 'web-push'
import * as webpush from 'web-push'

import { pushConfig } from '@/server/config'

@Injectable()
export class PushService {
  constructor(
    @Inject(pushConfig.KEY)
    private readonly pushConf: ConfigType<typeof pushConfig>
  ) {
    webpush.setVapidDetails(this.pushConf.subject, this.pushConf.publicKey, this.pushConf.privateKey)
  }

  async sendNotification(pushSubscription: PushSubscription, content: string) {
    return webpush.sendNotification(pushSubscription, content)
  }
}
