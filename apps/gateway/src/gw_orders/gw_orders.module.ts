import { Module } from '@nestjs/common';
import { GwOrdersService } from './gw_orders.service';
import { GwOrdersController } from './gw_orders.controller';
import {
  ORDERS_QUEUE,
  ORDERS_SERVICE,
  PAYMENTS_QUEUE,
  PAYMENTS_SERVICE,
  RmqModule,
} from '@app/common';
import { GwAuthModule } from '../gw_auth/gw_auth.module';

@Module({
  imports: [
    GwAuthModule,
    RmqModule.register({ serviceName: ORDERS_SERVICE, queue: ORDERS_QUEUE }),
    RmqModule.register({
      serviceName: PAYMENTS_SERVICE,
      queue: PAYMENTS_QUEUE,
    }),
  ],
  controllers: [GwOrdersController],
  providers: [GwOrdersService],
})
export class GwOrdersModule {}
