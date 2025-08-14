import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { Model } from 'mongoose';
import { defaultRoles } from './schemas/roles';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  async seedRoles() {
    for (const role of defaultRoles) {
      const existingRole = await this.roleModel
        .findOne({ name: role.name })
        .exec();
      if (!existingRole) {
        await this.roleModel.create({
          name: role.name,
          permissions: role.permissions,
        });
      }
    }
  }

  async findRoleByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).exec();
  }
}
