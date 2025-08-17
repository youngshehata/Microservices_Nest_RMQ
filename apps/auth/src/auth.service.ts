import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { LoginDto } from '@app/common/dtos/users/login.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private readonly userService: UsersService,
  ) {}
  async validateUser(credentials: LoginDto) {
    const user = await this.userService.validateUser(credentials);
    if (!user) {
      throw new RpcException('Invalid Credentials');
    }
    return user;
  }

  async login(credentials: LoginDto) {
    const user = await this.validateUser(credentials);
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };

    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken };
  }
}
