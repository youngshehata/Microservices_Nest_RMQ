import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_SERVICE, HAS_ROLE_PATTERN, RpcResponse } from '@app/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required roles from metadata
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required → allow access
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

    // Send user ID and required roles to Auth Service
    const response: RpcResponse = await firstValueFrom(
      this.authClient.send(HAS_ROLE_PATTERN, {
        userId,
        roles: requiredRoles,
      }),
    );

    if (response.error) {
      throw new HttpException(
        response.error.message,
        response.error.statusCode,
      );
    }

    return response.data === true;
  }
}
