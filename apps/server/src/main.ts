import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigType } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { apiConfig, storageConfig } from '@/server/config'
import { ProcessTimeInterceptor, ResponseWrapInterceptor } from '@/server/common/interceptor'
import { OtherExceptionFilter, HttpExceptionFilter } from '@/server/common/filter'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const apiConf = app.get<ConfigType<typeof apiConfig>>(apiConfig.KEY)
  const storageConf = app.get<ConfigType<typeof storageConfig>>(storageConfig.KEY)
  app.enableCors()
  app.setGlobalPrefix('/api')
  app.useGlobalInterceptors(new ProcessTimeInterceptor())
  app.useGlobalInterceptors(new ResponseWrapInterceptor())
  app.useGlobalFilters(new OtherExceptionFilter())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true
    })
  )
  app.useStaticAssets(join(__dirname, 'assets'))

  // 语言文件位置 部署后从dist启动刚好也是3层
  app.useStaticAssets(join(__dirname, '../../../locales'), { prefix: '/locales' })
  if (storageConf.mode === 'local') {
    // 存储本地模式图片存储的位置
    app.useStaticAssets(join(__dirname, '../../../uploadfiles'), { prefix: '/upload' })
  }

  const config = new DocumentBuilder().setTitle('ying app').setDescription('ying app').setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true
  })
  SwaggerModule.setup('doc', app, document)

  await app.listen(apiConf.port)
  Logger.log(`🚀 Application is running on: http://localhost:${apiConf.port}/api`, 'Main')
}
bootstrap()
