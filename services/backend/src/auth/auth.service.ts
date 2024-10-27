import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignInException, SignUpException } from './constants';
import { JwtPayload } from './auth.interface';
import SignUpDto from './dto/sign-up.dto';
import { User } from 'src/users/user.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import UserLoggedInEvent from './events/user-logged-in.event';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private eventEmitter: EventEmitter2,
    ) {}


    /**
     * Sign a jwt token for a user.
     * @param login - user's login.
     * @param password - user's password processed by bcrypt.
     * @returns - jwt signed token or an encountered SignIn exception type.
     */
    async signIn(loginOrEmail: string, password: string, searchBy: 'login' | 'email'): Promise<string | SignInException> {
        let user;
        if(searchBy === 'login') {
            user = await this.usersService.findOneByLogin(loginOrEmail);
        } else {
            user = await this.usersService.findOneByEmail(loginOrEmail);
        }

        if(!user) return SignInException.UserNotFound;
        if(user.password !== password) return SignInException.WrongPassword;
        if(!user.verified) return SignInException.UserUnverified;
        
        const payload: JwtPayload = { sub: user.id, login: user.login };
        const signedPayload = await this.jwtService.signAsync(payload);
        this.eventEmitter.emit(UserLoggedInEvent.eventName, new UserLoggedInEvent(user.id))
        return signedPayload;
    }


    /**
     * Create a new user.
     * @param data - new user's data.
     */
    async signUp(data: SignUpDto): Promise<SignUpException | User> {
        if(await this.usersService.hasByLogin(data.login)) {
            return SignUpException.LoginOccupied;
        } else if(await this.usersService.hasByEmail(data.email)) {
            return SignUpException.EmailOccupied;
        }

        return await this.usersService.createOne(
            data.login,
            data.nickname,
            data.password,
            data.email,
            false
        );
    }
}