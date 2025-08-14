import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongoDBModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION || '1h',
        algorithm: 'RS256',
      },
    }),
    MongoDBModule,
    UsersModule,
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
