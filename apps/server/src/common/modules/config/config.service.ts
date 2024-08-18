import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { RedisClientType } from 'redis'

import { ConfigDto, ConfigVo } from '@ying/shared'

import { apiConfig } from '@/server/config'
import { RedisKey, RedisToken } from '@/server/common/modules/redis/constant'

const DefaultCustomerConfig = {
  debugUserIds: ''
}

@Injectable()
export class ConfigService {
  @Inject(RedisToken)
  private readonly redisClient: RedisClientType

  @Inject(apiConfig.KEY)
  private readonly apiConf: ConfigType<typeof apiConfig>

  async getConfig(): Promise<ConfigVo> {
    const configStr = await this.redisClient.get(RedisKey.Config)
    if (!configStr) {
      const config: ConfigVo = {
        ...DefaultCustomerConfig,
        clientUrl: this.apiConf.clientUrl
      }
      await this.redisClient.set(RedisKey.Config, JSON.stringify(config))
      return config
    }
    return JSON.parse(configStr)
  }

  async setConfig(dto: ConfigDto) {
    const config = JSON.parse(await this.redisClient.get(RedisKey.Config))
    await this.redisClient.set(RedisKey.Config, JSON.stringify(Object.assign(config, dto)))
  }
}
