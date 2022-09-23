import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DatabaseErrorInterceptor } from './common/database-error.interceptor';
import { HttpExceptionFilter } from './common/http-error.filter';
import { logger } from './common/logger.middleware';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // log requests, etc
  app.use(logger);
  app.enableCors();

  // use this pipe to validate http requests app wide
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // skipMissingProperties: true,
    }),
  );

  // handle errors globally and in one standard fashion
  app.useGlobalInterceptors(
    new DatabaseErrorInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // API Docs Set Up
  const apiDocsConfig = new DocumentBuilder()
    .setTitle('Project Internal API')
    .setDescription('Project Internal API')
    .setVersion('1.0')
    .addTag('Project')
    .addBearerAuth()
    .build();

  const apiDocs = SwaggerModule.createDocument(app, apiDocsConfig);
  SwaggerModule.setup('api', app, apiDocs, {
    swaggerOptions: {
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 3001);
}

bootstrap();
