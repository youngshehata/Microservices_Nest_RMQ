import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { GATEWAY_QUEUE, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const rmqService = app.get(RmqService);
  const options = rmqService.getOptions(GATEWAY_QUEUE);
  app.connectMicroservice(options);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
