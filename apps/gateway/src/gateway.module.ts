import { Module, UseGuards } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { GwOrdersModule } from './gw_orders/gw_orders.module';
import { GwAuthModule } from './gw_auth/gw_auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    GwOrdersModule,
    GwAuthModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService, { provide: UseGuards, useClass: AuthGuard }],
})
export class GatewayModule {}
