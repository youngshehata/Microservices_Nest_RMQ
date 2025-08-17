import { Module } from '@nestjs/common';
import { GwAuthService } from './gw_auth.service';
import { GwAuthController } from './gw_auth.controller';
import { AUTH_QUEUE, AUTH_SERVICE, RmqModule } from '@app/common';

@Module({
  imports: [
    RmqModule.register({ serviceName: AUTH_SERVICE, queue: AUTH_QUEUE }),
  ],
  controllers: [GwAuthController],
  providers: [GwAuthService],
  exports: [GwAuthService, RmqModule],
})
export class GwAuthModule {}
