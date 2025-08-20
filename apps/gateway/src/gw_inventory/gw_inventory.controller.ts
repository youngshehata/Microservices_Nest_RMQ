import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GwInventoryService } from './gw_inventory.service';
import { CreateItemDto } from '@app/common';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('inventory')
export class GwInventoryController {
  constructor(private readonly gwInventoryService: GwInventoryService) {}

  //! ======================== CREATE ITEM ========================

  @Roles('user', 'admin')
  @Post('item')
  async createItem(@Body() data: CreateItemDto, @Req() req: any) {
    return await this.gwInventoryService.createItem({
      ...data,
      addedBy: req.user.id,
    });
  }
}
