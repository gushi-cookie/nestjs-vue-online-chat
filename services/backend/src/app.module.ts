import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configFactory from './config/config.factory';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { AppConfig, LogMode, MongoConfig, SQLConfig } from './config/config.types';
import { ConfigKey } from './config/constants';
import { User } from './users/user.model';
import { Role } from './roles/role.model';
import { RolesModule } from './roles/roles.module';
import { VerificationSession } from './verifications/verification-session.model';
import { MailerModule } from './mailer/mailer.module';
import { TemplatesModule } from './templates/templates.module';
import { appProviders } from './app.providers';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { VerificationsModule } from './verifications/verifications.module';
import { UserProfile } from './user-profiles/user-profile.model';
import { UserProfilesModule } from './user-profiles/user-profiles.module';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';


@Module({
    imports: [
        UserProfilesModule,
        VerificationsModule,
        EventEmitterModule.forRoot({
            global: true,
            verboseMemoryLeak: true,
        }),
        TemplatesModule,
        MailerModule,
        RolesModule,
        UsersModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            ignoreEnvVars: true,
            load: configFactory,
        }),
        SequelizeModule.forRootAsync({
            inject: [ConfigService],

            useFactory: async (configService: ConfigService) => {
                const config = configService.get<SQLConfig>(ConfigKey.SQL);
                const appConfig = configService.get<AppConfig>(ConfigKey.App);
                if (!config) throw new Error(`SQLConfig is '${config}'`);
                if (!appConfig) throw new Error(`AppConfig is '${appConfig}'`);

                const options: SequelizeModuleOptions = {
                    dialect: 'postgres',
                    host: config.host,
                    port: config.port,
                    username: config.user,
                    password: config.password,
                    database: config.database,
                    models: [Role, User, VerificationSession, UserProfile],
                    logging: appConfig.logMode === LogMode.Debug,
                };
                return options;
            }
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],

            useFactory: (configService: ConfigService) => {
                const config = configService.get<MongoConfig>(ConfigKey.Mongo);
                if(!config) throw new Error(`MongoConfig is '${config}'`);

                const options: MongooseModuleFactoryOptions = {
                    auth: {
                        username: config.user,
                        password: config.password,
                    },

                    uri: `mongodb://${config.host}:${config.port}`,
                };

                return options;
            },
        }),
    ],
    providers: [...appProviders],
    exports: [...appProviders],
})
export class AppModule { }