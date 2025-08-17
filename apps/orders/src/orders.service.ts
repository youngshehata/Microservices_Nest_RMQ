import { Injectable } from '@nestjs/common';
import { OrdersRepo } from './orders.repo';
import { CreateOrderDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepo: OrdersRepo) {}
  async createOrder(data: CreateOrderDto) {
    try {
      return await this.ordersRepo.create(data);
    } catch (error) {
      console.log(error);
      throw new RpcException(error.message);
    }
  }
}
