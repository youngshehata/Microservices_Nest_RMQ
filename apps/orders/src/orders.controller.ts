import { Body, Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ATTACH_PAYMENT_PATTERN,
  CREATE_ORDER_PATTERN,
  CreateOrderDto,
  FIND_ONE_ORDER_PATTERN,
} from '@app/common';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  // ! ======================= CREATE ORDER =======================
  @MessagePattern(CREATE_ORDER_PATTERN)
  createOrder(
    @Payload()
    data: CreateOrderDto,
  ) {
    console.log(data);

    return this.ordersService.createOrder(data);
  }

  // ! ======================= ATTACH PAYMENT =======================
  @MessagePattern(ATTACH_PAYMENT_PATTERN)
  attachPayment(@Payload() data: { paymentID: string; orderID: string }) {
    return this.ordersService.attachPayment(data.paymentID, data.orderID);
  }
  // ! =======================FIND ONE =======================
  @MessagePattern(FIND_ONE_ORDER_PATTERN)
  findOne(@Payload() data: any) {
    return this.ordersService.findOne(data);
  }
}
