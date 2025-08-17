import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { LoginDto } from '@app/common/dtos/users/login.dto';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { DecodedToken } from './types/decoded_token';
import { RpcResponse } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  //!============================== VALIDATE USER ================================
  async validateUser(credentials: LoginDto) {
    const user = await this.userService.validateUser(credentials);
    if (!user) {
      throw new RpcException('Invalid Credentials');
    }
    return user;
  }

  //!============================== LOGIN ================================
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
  //!============================== VALIDATE TOKEN ================================
  async validateToken(
    token: string,
  ): Promise<RpcResponse<DecodedToken | null>> {
    const publicKey = this.configService.get<string>('JWT_PUBLIC_KEY');
    if (!publicKey) {
      throw new RpcException('Invalid JWT public key');
    }

    try {
      const payload = await this.jwt.verifyAsync(token, {
        publicKey: process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n'),
      });

      const decoded: DecodedToken = {
        id: payload.sub,
        username: payload.username,
        roles: payload.roles,
      };

      return { data: decoded };
    } catch (error) {
      return {
        data: null,
        error: {
          message: 'Invalid Token',
          statusCode: 401,
        },
      };
    }
  }
}
