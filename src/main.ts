import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './core/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Настройка приложения
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // выкидывает лишние поля
      forbidNonWhitelisted: true,
      transform: true, // приводит типы к DTO
    }),
  );

  // Запуск приложения
  const port = config.get<number>('PORT') || 4000;
  await app.listen(port);
  console.log(`Приложение запущено на порту ${port}`);
}
bootstrap();
