import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignInDto from './dto/sign-in.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { };

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: SignInDto) {
        return {
            access_token: await this.authService.signIn(signInDto.login, signInDto.password),
        };
    }
}