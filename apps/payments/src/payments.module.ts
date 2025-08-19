import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MongoDBModule, RmqModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import {
  PaymentStatus,
  PaymentStatusSchema,
} from './schemas/payment-status.schema';
import { PaymentsRepo } from './payments.repo';
import { PaymentsStatusesRepo } from './payments-statuses.repo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/payments/.env',
    }),
    RmqModule,
    MongoDBModule,
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: PaymentStatus.name, schema: PaymentStatusSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepo, PaymentsStatusesRepo],
})
export class PaymentsModule {}
