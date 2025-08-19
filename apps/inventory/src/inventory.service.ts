import { CreateItemDto } from '@app/common/dtos/inventory/create-item.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryRepo } from './inventory.repo';
import { FilterQuery } from 'mongoose';
import { Item } from './schemas/item.schema';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepo: InventoryRepo) {}

  //! Create a new inventory item
  async createItem(item: CreateItemDto) {
    return this.inventoryRepo.create(item);
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
