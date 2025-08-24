import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@app/common/dtos/users/login.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateUserDto } from '@app/common/dtos/users/create-user.dto';
import { UsersService } from './users/users.service';
import {
  HAS_ROLE_PATTERN,
  LOGIN_PATTERN,
  REGISTER_PATTERN,
  RmqService,
  RpcResponse,
  VALIDATE_TOKEN_PATTERN,
} from '@app/common';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly rmqService: RmqService,
  ) {}

  //! ============================== REGISTER USER ================================
  @MessagePattern(REGISTER_PATTERN)
  async registerUser(
    @Body() userData: CreateUserDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      const user = await this.usersService.register(userData);
      this.rmqService.ack(context);
      return { data: user } as RpcResponse;
    } catch (error) {
      const response: RpcResponse = {
        data: null,
        error: {
          statusCode: 400,
          message: error.message,
        },
      };
      return response;
    }
  }

  //! ============================== LOGIN USER ================================
  @MessagePattern(LOGIN_PATTERN)
  async login(@Payload() credentials: LoginDto, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    try {
      const user = await this.authService.login(credentials);
      const response: RpcResponse = {
        data: user,
      };
      return response;
    } catch (error) {
      const response: RpcResponse = {
        data: null,
        error: {
          statusCode: 400,
          message: error.message,
        },
      };
      return response;
    }
  }

  //! ============================== VALIDATE TOKEN ================================
  @MessagePattern(VALIDATE_TOKEN_PATTERN)
  async validateToken(@Payload() token: string, @Ctx() context: RmqContext) {
    const decodedToken = await this.authService.validateToken(token);
    this.rmqService.ack(context);
    return decodedToken;
  }

  //! ============================== HAS ROLE ? ================================
  @MessagePattern(HAS_ROLE_PATTERN)
  async hasRole(
    @Payload() payload: { userId: string; roles: string[] },
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    const { userId, roles } = payload;

    const hasRole = await this.usersService.hasAnyRole(userId, roles);
    if (!hasRole) {
      return {
        data: false,
        error: {
          statusCode: 403,
          message: 'Access Denied',
        },
      } as RpcResponse;
    }
    return { data: true };
  }
}
