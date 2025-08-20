import { CreateItemDto, INVENTORY_SERVICE, RpcResponse } from '@app/common';
import { CREATE_ITEM_PATTERN } from '@app/common/constraints/inventory/inventory-patterns.constraints';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GwInventoryService {
  constructor(
    @Inject(INVENTORY_SERVICE) private readonly inventoryClient: ClientProxy,
  ) {}

  async createItem(item: CreateItemDto) {
    const response: RpcResponse = await firstValueFrom(
      this.inventoryClient.send(CREATE_ITEM_PATTERN, item),
    );

    if (response.error)
      throw new HttpException(
        response.error.message,
        response.error.statusCode,
      );
    else {
      return response.data;
    }
  }
}
