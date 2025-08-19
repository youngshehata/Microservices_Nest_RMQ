import { Module, UseGuards } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { GwOrdersModule } from './gw_orders/gw_orders.module';
import { GwAuthModule } from './gw_auth/gw_auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { GwInventoryModule } from './gw_inventory/gw_inventory.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    GwOrdersModule,
    GwAuthModule,
    GwInventoryModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class GatewayModule {}
