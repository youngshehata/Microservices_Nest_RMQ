import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '@app/common/dtos/users/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
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
}
