import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Types } from 'mongoose';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(
    @Body()
    data: {
      payment: Types.ObjectId;
      items: { _id: Types.ObjectId; count: number }[];
    },
  ) {
    return this.ordersService.createOrder(data);
  }
}
