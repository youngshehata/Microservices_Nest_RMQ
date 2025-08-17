import { AUTH_SERVICE, RmqService, RpcResponse } from '@app/common';
import {
  LOGIN_PATTERN,
  REGISTER_PATTERN,
  VALIDATE_TOKEN_PATTERN,
} from '@app/common/constraints/auth/auth-patterns.constraints';
import { CreateUserDto } from '@app/common/dtos/users/create-user.dto';
import { LoginDto } from '@app/common/dtos/users/login.dto';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqContext } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GwAuthService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async lognIn(data: LoginDto, ctx: RmqContext) {
    const result = await firstValueFrom(
      this.authClient.send(LOGIN_PATTERN, data),
    );
    return result;
  }

  async register(user: CreateUserDto) {
    return await firstValueFrom(this.authClient.send(REGISTER_PATTERN, user));
  }

  async validateToken(token: string) {
    const response: RpcResponse = await firstValueFrom(
      this.authClient.send(VALIDATE_TOKEN_PATTERN, token),
    );
    if (response.error) {
      throw new HttpException(
        response.error.message,
        response.error.statusCode,
      );
    }
    return response;
  }
}
