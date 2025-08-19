import { Body, Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern } from '@nestjs/microservices';
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
    @Body()
    data: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(data);
  }

  // ! ======================= ATTACH PAYMENT =======================
  @MessagePattern(ATTACH_PAYMENT_PATTERN)
  attachPayment(@Body() data: { paymentID: string; orderID: string }) {
    return this.ordersService.attachPayment(data.paymentID, data.orderID);
  }
  // ! =======================FIND ONE =======================
  @MessagePattern(FIND_ONE_ORDER_PATTERN)
  findOne(@Body() data: any) {
    return this.ordersService.findOne(data);
  }
}
