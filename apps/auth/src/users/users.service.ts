import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersRepo } from './users.repo';
import { CreateUserDto } from '@app/common/dtos/users/create-user.dto';
import { defaultQuestions } from './schemas/questions';
import { LoginDto } from '@app/common/dtos/users/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepo,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

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

  async seedAdminUser() {
    const adminExists = await this.usersRepo.checkUserExists('admin');
    if (!adminExists) {
      await this.usersRepo.registerAdmin();
    }
  }

  //! =============================== IS ADMIN ================================
  async validateAdmin(userId: string) {
    return await this.usersRepo.validateAdmin(userId);
  }

  //! =============================== HAS ANY ROLE ================================
  async hasAnyRole(userId: string, roles: string[]) {
    return this.usersRepo.hasAnyRole(userId, roles);
  }
}
