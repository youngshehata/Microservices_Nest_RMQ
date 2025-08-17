import { AbstractDocument } from '@app/common/database/abstract.repo';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Connection, Model } from 'mongoose';

@Injectable()
export class OrdersRepo extends AbstractDocument<Order> {
  constructor(
    @InjectModel(Order.name) orderModel: Model<Order>,
    @InjectConnection() connection: Connection,
  ) {
    super(connection, orderModel);
  }
}
