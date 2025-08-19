import { Body, Controller, Post } from '@nestjs/common';
import { GwAuthService } from './gw_auth.service';
import { LoginDto } from '@app/common/dtos/users/login.dto';
import { CreateUserDto } from '@app/common/dtos/users/create-user.dto';
import { RmqContext } from '@nestjs/microservices';
import { Public } from '../gw_orders/decorators/public.decorator';

@Public()
@Controller('auth')
export class GwAuthController {
  constructor(private readonly gwAuthService: GwAuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.gwAuthService.lognIn(data);
  }

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return await this.gwAuthService.register(data);
  }
}
