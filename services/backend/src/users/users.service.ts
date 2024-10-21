import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Role } from 'src/roles/role.model';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User
    ) {};


    async createOne(login: string, nickname: string, password: string, email: string, verified: boolean): Promise<User> {
        return await this.userModel.create({
            login,
            nickname,
            password,
            email,
            verified,
            roleId: 3,
        });
    }

    async findOneByLogin(login: string): Promise<User | null> {
        return this.userModel.findOne({
            where: { login },
            include: [Role],
        });
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({
            where: { email },
            include: [Role],
        });
    }

    async findOneById(id: number): Promise<User | null> {
        return this.userModel.findOne({
            where: { id },
            include: [Role],
        });
    }

    async hasByLogin(login: string): Promise<boolean> {
        return await this.userModel.count({
            where: { login }
        }) > 0;
    }

    async hasByEmail(email: string): Promise<boolean> {
        return await this.userModel.count({
            where: { email }
        }) > 0;
    }
}