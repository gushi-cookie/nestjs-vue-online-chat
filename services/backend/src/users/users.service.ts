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


    async findOneByLogin(login: string): Promise<User | null> {
        return this.userModel.findOne({
            where: { login },
            include: [Role],
        });
    }

    async findOneById(id: number): Promise<User | null> {
        return this.userModel.findOne({
            where: { id },
            include: [Role],
        });
    }
}