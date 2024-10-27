import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInByLoginDto, SignInByEmailDto, signInDtos, signInApiBodyOptions, signInApiExtraModels } from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up.dto';
import { SignInException, SignUpException } from './constants';
import { TemplatesService } from 'src/templates/templates.service';
import { VerificationsService } from 'src/verifications/verifications.service';
import { CreationException } from 'src/verifications/constants';
import { MailerService } from 'src/mailer/mailer.service';
import { ApiBody, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { MultiDtoValidationPipe } from 'src/common/pipes/multi-dto-validation.pipe';
import { EventEmitter2 } from '@nestjs/event-emitter';
import UserCreatedEvent from './events/user-created.event';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private templatesService: TemplatesService,
        private verificationsService: VerificationsService,
        private mailerService: MailerService,
        private eventEmitter: EventEmitter2,
    ) { };


    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiBody(signInApiBodyOptions)
    @ApiExtraModels(...signInApiExtraModels)
    async signIn(@Body(new MultiDtoValidationPipe(signInDtos)) data: SignInByLoginDto | SignInByEmailDto) {
        let token;
        if(data instanceof SignInByLoginDto) {
            token = await this.authService.signIn(data.login, data.password, 'login');
        } else if(data instanceof SignInByEmailDto) {
            token = await this.authService.signIn(data.email, data.password, 'email');
        }

        if(token === SignInException.UserNotFound || token === SignInException.WrongPassword) {
            throw new UnauthorizedException('User not found or wrong password.');
        } else if(token === SignInException.UserUnverified) {
            throw new UnauthorizedException('User not verified.');
        } else {
            return { accessToken: token };
        }
    } 

    @HttpCode(HttpStatus.OK)
    @Post('register')
    @ApiBody({ type: SignUpDto })
    async signUp(@Body() data: SignUpDto) {
        let user = await this.authService.signUp(data);

        if(user === SignUpException.EmailOccupied) {
            throw new UnauthorizedException('Email occupied.');
        } else if(user === SignUpException.LoginOccupied) {
            throw new UnauthorizedException('Login occupied.');
        }
        // TO-DO Add support for profile pics.

        let token = await this.verificationsService.createUserRegistrationSession({ userId: user.id });
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
        this.eventEmitter.emit(UserCreatedEvent.eventName, new UserCreatedEvent(user.id, undefined));
    }
}