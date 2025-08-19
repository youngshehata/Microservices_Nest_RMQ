import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { PAYMENTS_QUEUE, RmqService } from '@app/common';
import { PaymentsService } from './payments.service';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  // seed payment statuses
  const paymentsService = app.get(PaymentsService);
  await paymentsService.seedPaymentStatus();

  const rmqService = app.get(RmqService);
  const serviceOptions = rmqService.getOptions(PAYMENTS_QUEUE);
  app.connectMicroservice(serviceOptions);
  await app.startAllMicroservices();
}
bootstrap();
