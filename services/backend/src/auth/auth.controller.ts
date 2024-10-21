import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignInDto from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up.dto';
import { SignInException, SignUpException } from './constants';
import { TemplatesService } from 'src/templates/templates.service';
import { VerificationsService } from 'src/verifications/verifications.service';
import { CreationException, SessionType } from 'src/verifications/constants';
import { MailerService } from 'src/mailer/mailer.service';
import { SignUpVerificationPayload } from './auth.interface';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private templatesService: TemplatesService,
        private verificationsService: VerificationsService,
        private mailerService: MailerService,
    ) { };


    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() data: SignInDto) {
        let token;
        if(data.login) {
            token = await this.authService.signIn(data.login, data.password, 'login');
        } else if(data.email) {
            token = await this.authService.signIn(data.email, data.password, 'email');
        } else {
            throw new InternalServerErrorException('Unexpected scenario.');
        }

        if(token === SignInException.UserNotFound || token === SignInException.WrongPassword) {
            throw new UnauthorizedException('User not found or wrong password.')
        } else if(token === SignInException.UserUnverified) {
            throw new UnauthorizedException('User not verified.');
        }

        return { accessToken: token };
    }

    @HttpCode(HttpStatus.OK)
    @Post('register')
    async signUp(@Body() data: SignUpDto) {
        let user = await this.authService.signUp(data);

        if(user === SignUpException.EmailOccupied) {
            throw new UnauthorizedException('Email occupied.');
        } else if(user === SignUpException.LoginOccupied) {
            throw new UnauthorizedException('Login occupied.');
        }

        let verificationPayload: SignUpVerificationPayload = {
            userId: user.id,
        };
        let token = await this.verificationsService.createSession(verificationPayload, SessionType.Registration);


        if(token === CreationException.SessionsLimitExceeded) {
            await user.destroy();
            throw new InternalServerErrorException('Unexpected scenario.');
        }


        let verifyLink = this.verificationsService.createLink(token);

        let renderedHtml = this.templatesService.templates.email.regVerification.renderHtml({
            nickname: user.nickname,
            verifyLink
        }, data.locale);

        let renderedPlain = this.templatesService.templates.email.regVerification.renderPlain({
            nickname: user.nickname,
            verifyLink,
        }, data.locale);

        await this.mailerService.sendMail([data.email], renderedHtml.subject, renderedPlain.template, renderedHtml.template);
    }
}