import { Injectable } from '@nestjs/common';
import { OrdersRepo } from './orders.repo';
import { Types } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepo: OrdersRepo) {}
  createOrder(data: {
    payment: Types.ObjectId;
    items: { _id: Types.ObjectId; count: number }[];
  }) {
    console.log(data);

    return this.ordersRepo.create(data);
  }
}
