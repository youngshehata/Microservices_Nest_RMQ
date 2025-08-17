import { Body, Controller, Post } from '@nestjs/common';
import { GwAuthService } from './gw_auth.service';
import { LoginDto } from '@app/common/dtos/users/login.dto';
import { CreateUserDto } from '@app/common/dtos/users/create-user.dto';
import { RmqContext } from '@nestjs/microservices';

@Controller('gw-auth')
export class GwAuthController {
  constructor(private readonly gwAuthService: GwAuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto, ctx: RmqContext) {
    return await this.gwAuthService.lognIn(data, ctx);
  }

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return await this.gwAuthService.register(data);
  }
}
