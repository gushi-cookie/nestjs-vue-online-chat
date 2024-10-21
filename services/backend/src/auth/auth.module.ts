import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKey } from 'src/config/constants';
import { AuthConfig } from 'src/config/config.types';
import { authProviders } from './auth.providers';
import { TemplatesModule } from 'src/templates/templates.module';
import { VerificationsModule } from 'src/verifications/verifications.module';
import { MailerModule } from 'src/mailer/mailer.module';


@Module({
    imports: [
        MailerModule,
        VerificationsModule,
        TemplatesModule,
        ConfigModule,
        UsersModule,
        JwtModule.registerAsync({
            inject: [ConfigService],

            useFactory: async (configService: ConfigService) => {
                const config = configService.get<AuthConfig>(ConfigKey.Auth);
                if (!config) throw new Error(`AuthConfig is ${config}.`);

                const options: JwtModuleOptions = {
                    secret: config.jwtSecret,
                    global: true,
                    signOptions: { expiresIn: config.jwtExpiresIn },
                };
                return options;
            },
        }),
    ],
    providers: [AuthService, ...authProviders],
    exports: [AuthService, ...authProviders],
    controllers: [AuthController],
})
export class AuthModule { }