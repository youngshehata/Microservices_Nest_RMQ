import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { ORDERS_QUEUE, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  const rmqService = app.get(RmqService);
  const serviceOptions = rmqService.getOptions(ORDERS_QUEUE);
  app.connectMicroservice(serviceOptions);
  await app.startAllMicroservices();
}
bootstrap();
