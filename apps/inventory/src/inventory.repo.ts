import { AbstractDocument } from '@app/common/database/abstract.repo';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Item } from './schemas/item.schema';
import { Connection, Model } from 'mongoose';

@Injectable()
export class InventoryRepo extends AbstractDocument<Item> {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<Item>,
    @InjectConnection() connection: Connection,
  ) {
    super(connection, itemModel);
  }

  // ! ================================ CHECK ITEM NAME ================================
  async checkItemName(name: string): Promise<boolean> {
    const item = await this.itemModel.findOne({ name }).lean();
    return !!item;
  }
}
