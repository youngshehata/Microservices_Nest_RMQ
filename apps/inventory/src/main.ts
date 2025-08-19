import { NestFactory } from '@nestjs/core';
import { InventoryModule } from './inventory.module';
import { ValidationPipe } from '@nestjs/common';
import { INVENTORY_QUEUE, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(InventoryModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const rmqService = app.get(RmqService);
  const serviceOptions = rmqService.getOptions(INVENTORY_QUEUE);
  app.connectMicroservice(serviceOptions);
  await app.startAllMicroservices();
}
bootstrap();
