import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { RmqService } from '@app/common/rmq/rmq.service';
import { AUTH_QUEUE } from '@app/common/constraints/rmq-queues-contraints';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const rmqService = app.get(RmqService);
  const serviceOptions = rmqService.getOptions(AUTH_QUEUE);
  app.connectMicroservice(serviceOptions);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
