import { Body, Controller, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@app/common/dtos/users/login.dto';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { CreateUserDto } from '@app/common/dtos/users/create-user.dto';
import { UsersService } from './users/users.service';
import {
  HAS_ROLE_PATTERN,
  IS_ADMIN_PATTERN,
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
  async registerUser(@Body() userData: CreateUserDto) {
    try {
      return await this.usersService.register(userData);
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          statusCode: error.getStatus(),
          message: error.message,
        };
      }
      return {
        statusCode: 500,
        message: `User registration failed: ${error.message}`,
      };
    }
  }

  //! ============================== LOGIN USER ================================
  @MessagePattern(LOGIN_PATTERN)
  async login(@Payload() credentials: LoginDto) {
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

  // //! ============================== IS ADMIN ================================
  // @MessagePattern(IS_ADMIN_PATTERN)
  // async isAdmin(@Payload() user_id: string) {
  //   const isAdmin = await this.usersService.validateAdmin(user_id);
  //   if (!isAdmin) {
  //     const response: RpcResponse = {
  //       data: null,
  //       error: {
  //         statusCode: 403,
  //         message: 'Access Denied',
  //       },
  //     };
  //     return response;
  //   }
  //   const response: RpcResponse = {
  //     data: true,
  //   };
  //   return response;
  // }

  //! ============================== HAS ROLE ? ================================
  @MessagePattern(HAS_ROLE_PATTERN)
  async hasRole(@Payload() payload: { userId: string; roles: string[] }) {
    const { userId, roles } = payload;
    console.log(userId, roles);

    const hasRole = await this.usersService.hasAnyRole(userId, roles);
    if (!hasRole) {
      return {
        data: false,
        error: {
          statusCode: 403,
          message: 'Access Denied',
        },
      };
    }
    return { data: true };
  }
}
