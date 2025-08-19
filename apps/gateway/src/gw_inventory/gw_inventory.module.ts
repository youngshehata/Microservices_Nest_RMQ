import { Module } from '@nestjs/common';
import { GwInventoryService } from './gw_inventory.service';
import { GwInventoryController } from './gw_inventory.controller';
import { INVENTORY_QUEUE, INVENTORY_SERVICE, RmqModule } from '@app/common';

@Module({
  imports: [
    RmqModule.register({
      serviceName: INVENTORY_SERVICE,
      queue: INVENTORY_QUEUE,
    }),
  ],
  controllers: [GwInventoryController],
  providers: [GwInventoryService],
})
export class GwInventoryModule {}
