import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GwOrdersService } from './gw_orders.service';
import { CreateOrderDto } from '@app/common';
import { AuthGuard } from '../guards/auth.guard';

@Controller('orders')
export class GwOrdersController {
  constructor(private readonly gwOrdersService: GwOrdersService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createOrder(@Body() order: CreateOrderDto) {
    return await this.gwOrdersService.creatOrder(order);
  }
}
