import {
  AUTH_SERVICE,
  IS_ADMIN_PATTERN,
  RpcResponse,
  VALIDATE_TOKEN_PATTERN,
} from '@app/common';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] as string;
    if (!authHeader) {
      throw new UnauthorizedException('Missing Token');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Missing Token');
    }

    const isAdmin: RpcResponse = await firstValueFrom(
      this.authClient.send(IS_ADMIN_PATTERN, token),
    );

    if (isAdmin.error) {
      throw new HttpException(isAdmin.error.message, isAdmin.error.statusCode);
    }

    return isAdmin.data!!;
  }
}
