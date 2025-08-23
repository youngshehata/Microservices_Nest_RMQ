import { CreateItemDto } from '@app/common/dtos/inventory/create-item.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InventoryRepo } from './inventory.repo';
import { FilterQuery, Types } from 'mongoose';
import { Item } from './schemas/item.schema';
import { ItemsArray, RpcResponse } from '@app/common';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepo: InventoryRepo) {}

  //! Create a new inventory item
  async createItem(item: CreateItemDto) {
    const nameExists = await this.inventoryRepo.checkItemName(item.name);
    if (nameExists) throw new NotFoundException('Item name already exists');
    return this.inventoryRepo.create(item);
  }

  //! Validate multiple inventory items
  async validateAndMinusItems(items: ItemsArray) {
    try {
      let isError: any = null;
      for (const item of items) {
        const itemExists = await this.inventoryRepo.findOne({ _id: item._id });
        if (!itemExists) {
          isError = 'Item does not exist';
        }
        if (itemExists.quantity < item.count) {
          isError = 'Not enough quantity';
        }
        if (!isError)
          await this.inventoryRepo.updateOne(
            { quantity: itemExists.quantity - item.count },
            { _id: item._id },
          );
      }
      const response: RpcResponse = {
        error: isError ? { message: isError, statusCode: 400 } : undefined,
        data: isError ? null : true,
      };

      return response;
    } catch (error) {
      return {
        data: null,
        error: { message: error.message, statusCode: 400 },
      };
    }
  }

  //! Find one inventory item by filter
  async findOneItem(filter: FilterQuery<Item>) {
    return this.inventoryRepo.findOne(filter);
  }

  //! Find many inventory items by filter
  async findManyItems(filter: FilterQuery<Item>) {
    return this.inventoryRepo.findMany(filter);
  }

  //! Update one inventory item
  async updateItem(
    filter: FilterQuery<Item>,
    updateData: Partial<CreateItemDto>,
  ) {
    return this.inventoryRepo.updateOne(updateData, filter);
  }

  //! Delete one inventory item
  async deleteItem(filter: FilterQuery<Item>) {
    return this.inventoryRepo.deleteOne(filter);
  }
}
