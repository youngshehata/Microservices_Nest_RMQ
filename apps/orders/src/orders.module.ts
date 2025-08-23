import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {
  INVENTORY_QUEUE,
  INVENTORY_SERVICE,
  MongoDBModule,
  RmqModule,
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { ConfigModule } from '@nestjs/config';
import { OrdersRepo } from './orders.repo';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './apps/orders/.env' }),
    MongoDBModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    RmqModule.register({
      serviceName: INVENTORY_SERVICE,
      queue: INVENTORY_QUEUE,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepo],
})
export class OrdersModule {}
