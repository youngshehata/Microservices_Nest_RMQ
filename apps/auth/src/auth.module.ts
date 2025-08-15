import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongoDBModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './roles/roles.module';
import { RmqModule } from '@app/common/rmq/rmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    JwtModule.register({
      privateKey: process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      publicKey: process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n'),
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION || '1h',
        algorithm: 'RS256',
      },
    }),
    MongoDBModule,
    UsersModule,
    RolesModule,
    RmqModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
