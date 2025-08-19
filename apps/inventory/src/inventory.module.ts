import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { MongoDBModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { Item, ItemSchema } from './schemas/item.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryRepo } from './inventory.repo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/inventory/.env',
    }),
    RmqModule,
    MongoDBModule,
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepo],
})
export class InventoryModule {}
