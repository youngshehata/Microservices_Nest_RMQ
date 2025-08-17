import { AUTH_SERVICE, VALIDATE_TOKEN_PATTERN } from '@app/common';
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
export class AuthGuard implements CanActivate {
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

    const decodedToken = await firstValueFrom(
      this.authClient.send(VALIDATE_TOKEN_PATTERN, token),
    );

    if (decodedToken.error) {
      throw new HttpException(
        decodedToken.error.message,
        decodedToken.error.statusCode,
      );
    }
    request.user = decodedToken;
    return true;
  }
}
