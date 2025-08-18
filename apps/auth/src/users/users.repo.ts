import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Connection, isValidObjectId, Model } from 'mongoose';
import { CreateUserDto } from '@app/common/dtos/users/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Question } from './schemas/question.schema';
import { RolesService } from '../roles/roles.service';
import { LoginDto } from '@app/common/dtos/users/login.dto';
import { AbstractDocument } from '@app/common/database/abstract.repo';

@Injectable()
export class UsersRepo extends AbstractDocument<User> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    @InjectConnection() connection: Connection,
    private readonly rolesService: RolesService,
  ) {
    super(connection, userModel);
  }

  //! ================================ CREATE USER ================================
  async register(userData: CreateUserDto) {
    // Validate the question id
    if (!isValidObjectId(userData.secret_question)) {
      throw new HttpException('Invalid question ID format', 400);
    }
    const question = await this.questionModel
      .findById(userData.secret_question)
      .exec();
    if (!question) {
      throw new HttpException('Question not found', 404);
    }

    // Check if the user already exists
    const existingUser = await this.userModel
      .findOne({ username: userData.username })
      .exec();
    if (existingUser) {
      throw new HttpException('User already exists', 409);
    }

    // hashing the password and the secret answer
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.secret_answer = await bcrypt.hash(userData.secret_answer, 10);

    // getting the guest role id
    const guestRole = await this.rolesService.findRoleByName('guest');
    if (!guestRole) {
      throw new HttpException('Guest role not found', 500);
    }

    const newDoc = await this.userModel.create({
      ...userData,
      roles: [guestRole._id],
    });
    return {
      ...newDoc.toObject(),
      password: undefined,
      secret_answer: undefined,
      secret_question: undefined,
    };
  }

  //! ================================ VALIDATE USER ================================
  async validateUser(credentials: LoginDto) {
    const user = await this.userModel
      .findOne({ username: credentials.username })
      .exec();
    if (!user) {
      throw new HttpException('Invalid Credentials', 400);
    }
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid Credentials', 400);
    }
    return {
      id: user._id,
      username: user.username,
      roles: user.roles,
    };
  }

  //! ================================ FIND QUESTION ================================
  async findQuestionByText(questionText: string) {
    return this.questionModel.findOne({ question: questionText }).exec();
  }

  //! ================================ CREATE QUESTION ================================
  async createQuestion(question: string) {
    try {
      const newQuestion = new this.questionModel({ question });
      await newQuestion.save();
    } catch (error) {
      throw new Error(`Failed to create question: ${error.message}`);
    }
  }

  //! ================================ CHECK USER EXISTS ================================
  async checkUserExists(username: string): Promise<boolean> {
    const user = await this.userModel.findOne({ username }).exec();
    return !!user;
  }

  //! ================================ REGISTER ADMIN ================================
  async registerAdmin() {
    const adminRole = await this.rolesService.findRoleByName('admin');
    if (!adminRole) {
      throw new HttpException('Admin role not found', 500);
    }
    const question = await this.questionModel.find({}).exec();
    const questionID = question[0]._id;

    const admin = await this.userModel.create({
      username: 'admin',
      password: await bcrypt.hash('admin', 10),
      secret_question: questionID,
      secret_answer: await bcrypt.hash('admin', 10),
      roles: [adminRole._id],
    });
    return admin;
  }

  //! ================================ IS ADMIN ? ================================
  async validateAdmin(userId: string) {
    const user = await this.userModel
      .findOne({ _id: userId })
      .populate('roles')
      .exec(); // populates from roles collection
    console.log(user);

    const hasAdminRole = user?.roles.some((role: any) => role.name === 'admin');
    console.log(hasAdminRole);

    if (hasAdminRole) {
      return true;
    } else {
      return false;
    }
  }
}
