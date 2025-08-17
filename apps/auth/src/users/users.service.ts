import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersRepo } from './users.repo';
import { CreateUserDto } from '@app/common/dtos/users/create-user.dto';
import { defaultQuestions } from './schemas/questions';
import { LoginDto } from '@app/common/dtos/users/login.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepo) {}

  async register(usersData: CreateUserDto) {
    return await this.usersRepo.register(usersData);
  }

  async validateUser(credentials: LoginDto) {
    return await this.usersRepo.validateUser(credentials);
  }

  async seedQuestions() {
    let seededCount = 0;
    for (const question of defaultQuestions) {
      const existingQuestion =
        await this.usersRepo.findQuestionByText(question);
      if (!existingQuestion) {
        await this.usersRepo.createQuestion(question);
        seededCount++;
      }
    }
  }
}
