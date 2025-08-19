import { AUTH_SERVICE, IS_ADMIN_PATTERN, RpcResponse } from '@app/common';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isAdmin: RpcResponse = await firstValueFrom(
      this.authClient.send(IS_ADMIN_PATTERN, request.user.id),
    );

    if (isAdmin.error) {
      throw new HttpException(isAdmin.error.message, isAdmin.error.statusCode);
    }
    return isAdmin.data!!;
  }
}
