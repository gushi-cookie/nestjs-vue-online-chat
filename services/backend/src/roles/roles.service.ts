import { Injectable } from '@nestjs/common';
import { Role } from './role.model';
import { InjectModel } from '@nestjs/sequelize';


@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role)
        private rolesModel: typeof Role
    ) {}


    async findRoleById(id: number): Promise<Role | null> {
        return await this.rolesModel.findOne({
            where: { id }
        });
    }

    async findRoleByName(name: string): Promise<Role | null> {
        return await this.rolesModel.findOne({
            where: { name }
        });
    }
}