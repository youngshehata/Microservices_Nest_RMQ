import { Controller } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateItemDto } from '@app/common/dtos/inventory/create-item.dto';
import {
  CREATE_ITEM_PATTERN,
  FIND_ONE_ITEM_PATTERN,
  FIND_MANY_ITEMS_PATTERN,
  UPDATE_ITEM_PATTERN,
  DELETE_ITEM_PATTERN,
} from '@app/common/constraints/inventory/inventory-patterns.constraints';
import { FilterQuery } from 'mongoose';
import { Item } from './schemas/item.schema';

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  //! Create new inventory item
  @MessagePattern(CREATE_ITEM_PATTERN)
  createItem(@Payload() item: CreateItemDto) {
    return this.inventoryService.createItem(item);
  }

  //! Find one inventory item
  @MessagePattern(FIND_ONE_ITEM_PATTERN)
  findOneItem(@Payload() filter: FilterQuery<Item>) {
    return this.inventoryService.findOneItem(filter);
  }

  //! Find many inventory items
  @MessagePattern(FIND_MANY_ITEMS_PATTERN)
  findManyItems(@Payload() filter: FilterQuery<Item>) {
    return this.inventoryService.findManyItems(filter);
  }

  //! Update an inventory item
  @MessagePattern(UPDATE_ITEM_PATTERN)
  updateItem(
    @Payload()
    payload: {
      filter: FilterQuery<Item>;
      updateData: Partial<CreateItemDto>;
    },
  ) {
    const { filter, updateData } = payload;
    return this.inventoryService.updateItem(filter, updateData);
  }

  //! Delete an inventory item
  @MessagePattern(DELETE_ITEM_PATTERN)
  deleteItem(@Payload() filter: FilterQuery<Item>) {
    return this.inventoryService.deleteItem(filter);
  }
}
