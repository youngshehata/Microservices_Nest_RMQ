import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { GATEWAY_QUEUE, RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const rmqService = app.get(RmqService);
  const options = rmqService.getOptions(GATEWAY_QUEUE);
  app.connectMicroservice(options);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
