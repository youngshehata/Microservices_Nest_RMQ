import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private readonly userService: UsersService,
  ) {}
  async validateUser(username: string, pass: string) {
    const user = await this.userService.validateUser(username, pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(username: string, pass: string) {
    const user = await this.validateUser(username, pass);
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken };
  }
}
