import { Inject, Injectable } from '@nestjs/common';
import { OrdersRepo } from './orders.repo';
import {
  CreateOrderDto,
  INVENTORY_SERVICE,
  RpcResponse,
  VALIDATE_AND_MINUS_ITEMS_PATTERN,
} from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { FilterQuery, Types } from 'mongoose';
import { Order } from './schemas/order.schema';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepo: OrdersRepo,
    @Inject(INVENTORY_SERVICE) private readonly inventoryClient: ClientProxy,
  ) {}
  //! ======================= CREATE ORDER =======================
  async createOrder(data: CreateOrderDto) {
    try {
      const validItems: RpcResponse = await firstValueFrom(
        this.inventoryClient.send(VALIDATE_AND_MINUS_ITEMS_PATTERN, data.items),
      );
      if (validItems.error) {
        return { data: null, error: validItems.error } as RpcResponse;
      }
      const newOrder = await this.ordersRepo.create(data);
      return { data: newOrder };
    } catch (error) {
      return { data: null, error: { message: error.message, statusCode: 400 } };
    }
  }

  //! ======================= FIND ONE =======================
  async findOne(filterQuery: any) {
    try {
      return await this.ordersRepo.findOne(filterQuery);
    } catch (error) {
      console.log(error);
      throw new RpcException(error.message);
    }
  }

  //! ======================= FIND MANY =======================
  async findMany(filterQuery: FilterQuery<Order>) {
    try {
      return await this.ordersRepo.findMany(filterQuery);
    } catch (error) {
      console.log(error);
      throw new RpcException(error.message);
    }
  }

  //! ======================= UPDATE ONE =======================
  async updateOne(filterQuery: FilterQuery<Order>, data: any) {
    try {
      return await this.ordersRepo.updateOne(data, filterQuery);
    } catch (error) {
      console.log(error);
      throw new RpcException(error.message);
    }
  }

  //! ======================= DELETE ONE =======================
  async deleteOne(filterQuery: FilterQuery<Order>) {
    try {
      return await this.ordersRepo.deleteOne(filterQuery);
    } catch (error) {
      console.log(error);
      throw new RpcException(error.message);
    }
  }

  //! ======================== ATTATCH PAYMENT =======================
  async attachPayment(paymentID: string, orderID: string) {
    try {
      const payment_id = new Types.ObjectId(paymentID);
      return await this.ordersRepo.updateOne(
        { payment: payment_id },
        { _id: orderID },
      );
    } catch (error) {
      console.error(error);
      throw new RpcException(error.message);
    }
  }
}
