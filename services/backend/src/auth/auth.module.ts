import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKey } from 'src/config/constants';
import { AuthConfig } from 'src/config/config.types';


@Module({
    imports: [
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
                    signOptions: { expiresIn: config.expiresIn },
                };
                return options;
            },
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }