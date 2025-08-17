import { Body, Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern } from '@nestjs/microservices';
import { CREATE_ORDER_PATTERN, CreateOrderDto } from '@app/common';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @MessagePattern(CREATE_ORDER_PATTERN)
  createOrder(
    @Body()
    data: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(data);
  }
}
