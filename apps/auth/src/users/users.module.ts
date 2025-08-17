import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongoDBModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Question, QuestionSchema } from './schemas/question.schema';
import { UsersRepo } from './users.repo';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    MongoDBModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
    RolesModule,
  ],
  providers: [UsersService, UsersRepo],
  exports: [UsersService, UsersRepo],
})
export class UsersModule {}
