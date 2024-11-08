import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { OnEvent } from '@nestjs/event-emitter';
import UserRegistrationVerifiedEvent from 'src/verifications/events/user-registration-verified.event';
import PasswordChangeVerifiedEvent from 'src/verifications/events/password-change-verified.event';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User
    ) {};


    // #####################
    // #  Events Handling  #
    // #####################
    @OnEvent(UserRegistrationVerifiedEvent.eventName)
    async onRegistrationVerified(event: UserRegistrationVerifiedEvent) {
        let user = await this.findOneById(event.userId);
        if(!user) throw new Error('Unexpected scenario');
        
        user.verified = true;
        await user.save();
    }

    @OnEvent(PasswordChangeVerifiedEvent.eventName)
    async onPasswordChangeVerified(event: PasswordChangeVerifiedEvent) {
        let user = await this.findOneById(event.userId);
        if(!user) return;

        user.password = event.newPassword;
        await user.save();
    }


    // ######################
    // #  Public Interface  #
    // ######################
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
        });
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({
            where: { email },
        });
    }

    async findOneById(id: number): Promise<User | null> {
        return this.userModel.findOne({
            where: { id },
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