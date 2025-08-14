import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersRepo } from './users.repo';
import { CreateUserDto } from '@app/common/dtos/users/create-user.dto';
import { defaultQuestions } from './schemas/questions';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private readonly usersRepo: UsersRepo) {}

  async onModuleInit() {
    await this.seedQuestions();
  }

  async register(usersData: CreateUserDto) {
    return await this.usersRepo.register(usersData);
  }

  async validateUser(username: string, password: string) {
    return await this.usersRepo.validateUser(username, password);
  }

  async seedQuestions() {
    for (const question of defaultQuestions) {
      const existingQuestion =
        await this.usersRepo.findQuestionByText(question);
      if (!existingQuestion) {
        await this.usersRepo.createQuestion(question);
      }
    }
  }
}
