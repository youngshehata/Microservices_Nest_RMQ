import { Controller } from '@nestjs/common';
import { GwOrdersService } from './gw_orders.service';

@Controller('gw-orders')
export class GwOrdersController {
  constructor(private readonly gwOrdersService: GwOrdersService) {}
}
