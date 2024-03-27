import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigType } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import { apiConfig } from '@/config'
import { ProcessTimeInterceptor, ResponseWrapInterceptor } from '@/common/interceptor'
import { OtherExceptionFilter, HttpExceptionFilter } from '@/common/filter'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const apiConf = app.get<ConfigType<typeof apiConfig>>(apiConfig.KEY)
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
  app.useStaticAssets('static')

  const config = new DocumentBuilder().setTitle('ying app').setDescription('ying app').setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true
  })
  SwaggerModule.setup('doc', app, document)

  await app.listen(apiConf.port)
  Logger.log(`Application running on: http://localhost:${apiConf.port}/api`, 'Main')
}
bootstrap()
