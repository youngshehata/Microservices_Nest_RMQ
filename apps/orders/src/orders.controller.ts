import { Body, Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern } from '@nestjs/microservices';
import {
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
  // ! =======================FIND ONE =======================
  @MessagePattern(FIND_ONE_ORDER_PATTERN)
  findOne(@Body() data: any) {
    return this.ordersService.findOne(data);
  }
}
