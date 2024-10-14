import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(login: string, password: string): Promise<string> {
        const user = await this.usersService.findOneByLogin(login);
        
        if(!user || user.password !== password) {
            throw new UnauthorizedException();
        }
        
        const payload = { sub: user.id, login: user.login };
        return await this.jwtService.signAsync(payload);
    }
}