import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { AUTH_QUEUE, RmqService } from '@app/common';
import { UsersService } from './users/users.service';
import { RolesService } from './roles/roles.service';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const rmqService = app.get(RmqService);
  const serviceOptions = rmqService.getOptions(AUTH_QUEUE);
  // Seed Secret Questions
  const rolesService = app.get(RolesService);
  await rolesService.seedRoles();
  const usersService = app.get(UsersService);
  await usersService.seedQuestions();
  await usersService.seedAdminUser();
  app.connectMicroservice(serviceOptions);
  await app.startAllMicroservices();
  // await app.listen(process.env.port ?? 3001);
}
bootstrap();
