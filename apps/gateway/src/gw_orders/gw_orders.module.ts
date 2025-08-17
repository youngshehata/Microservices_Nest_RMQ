import { Module } from '@nestjs/common';
import { GwOrdersService } from './gw_orders.service';
import { GwOrdersController } from './gw_orders.controller';

@Module({
  controllers: [GwOrdersController],
  providers: [GwOrdersService],
})
export class GwOrdersModule {}
