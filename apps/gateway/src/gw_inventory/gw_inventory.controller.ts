import { Controller } from '@nestjs/common';
import { GwInventoryService } from './gw_inventory.service';

@Controller('gw-inventory')
export class GwInventoryController {
  constructor(private readonly gwInventoryService: GwInventoryService) {}
}
