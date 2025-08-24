import { Controller } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateItemDto } from '@app/common/dtos/inventory/create-item.dto';
import {
  CREATE_ITEM_PATTERN,
  FIND_ONE_ITEM_PATTERN,
  FIND_MANY_ITEMS_PATTERN,
  UPDATE_ITEM_PATTERN,
  DELETE_ITEM_PATTERN,
  VALIDATE_AND_MINUS_ITEMS_PATTERN,
} from '@app/common/constraints/inventory/inventory-patterns.constraints';
import { FilterQuery } from 'mongoose';
import { Item } from './schemas/item.schema';
import { ItemsArray, RmqService, RpcResponse } from '@app/common';

@Controller()
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rmqService: RmqService,
  ) {}

  //! =============================== Create new inventory item ===============================
  @MessagePattern(CREATE_ITEM_PATTERN)
  async createItem(@Payload() item: CreateItemDto, @Ctx() context: RmqContext) {
    try {
      const newItem = await this.inventoryService.createItem(item);
      const response: RpcResponse = { data: newItem };
      this.rmqService.ack(context);
      return response;
    } catch (error) {
      const response: RpcResponse = {
        data: null,
        error: { message: error.message, statusCode: 400 },
      };
      return response;
    }
  }

  //!=============================== VALIDATE LIST OF ITEMS ===============================
  @MessagePattern(VALIDATE_AND_MINUS_ITEMS_PATTERN)
  async validateAndMinusItems(
    @Payload() items: ItemsArray,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    try {
      const isValid = await this.inventoryService.validateAndMinusItems(items);
      const response: RpcResponse = { data: isValid };
      return response;
    } catch (error) {
      const response: RpcResponse = {
        data: null,
        error: { message: error.message, statusCode: 400 },
      };
      return response;
    }
  }

  //=============================== REST OF ENDPOINTS ===============================
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
