import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private readonly userService: UsersService,
  ) {}
  async validateUser(email: string, pass: string) {
    // TODO: lookup user (hash check, etc.)
    if (email !== 'admin@site.com' || pass !== 'secret') {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: 'u_123', email, roles: ['admin'] };
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken };
  }
}
