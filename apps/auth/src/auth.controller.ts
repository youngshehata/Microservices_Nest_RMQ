import { Body, Controller, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@app/common/dtos/users/login.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  LOGIN_PATTERN,
  REGISTER_PATTERN,
} from '@app/common/constraints/auth/auth-patterns.constraints';
import { CreateUserDto } from '@app/common/dtos/users/create-user.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

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

  @MessagePattern(LOGIN_PATTERN)
  async login(@Payload() credentials: LoginDto) {
    return await this.authService.login(credentials);
  }
}
