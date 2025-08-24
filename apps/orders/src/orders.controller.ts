import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  ATTACH_PAYMENT_PATTERN,
  CREATE_ORDER_PATTERN,
  CreateOrderDto,
  FIND_ONE_ORDER_PATTERN,
  RmqService,
  RpcResponse,
} from '@app/common';

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,
  ) {}
  // ! ======================= CREATE ORDER =======================
  @MessagePattern(CREATE_ORDER_PATTERN)
  async createOrder(
    @Payload()
    data: CreateOrderDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      const newOrder = await this.ordersService.createOrder(data);
      this.rmqService.ack(context);
      return { data: newOrder } as RpcResponse;
    } catch (error) {
      return {
        data: null,
        error: { message: error.message, statusCode: 400 },
      } as RpcResponse;
    }
  }

  // ! ======================= ATTACH PAYMENT =======================
  @MessagePattern(ATTACH_PAYMENT_PATTERN)
  async attachPayment(
    @Payload() data: { paymentID: string; orderID: string },
    @Ctx() context: RmqContext,
  ) {
    try {
      const attached = await this.ordersService.attachPayment(
        data.paymentID,
        data.orderID,
      );
      this.rmqService.ack(context);
      return {
        data: attached,
      } as RpcResponse;
    } catch (error) {
      return {
        data: null,
        error: { message: error.message, statusCode: 400 },
      };
    }
  }
  // ! =======================FIND ONE =======================
  // Not used till now...
  @MessagePattern(FIND_ONE_ORDER_PATTERN)
  findOne(@Payload() data: any) {
    return this.ordersService.findOne(data);
  }
}
