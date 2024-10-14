import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configFactory from './config/config.factory';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { AppConfig, LogMode, SQLConfig } from './config/config.types';
import { ConfigKey } from './config/constants';
import { User } from './users/user.model';
import { Role } from './roles/role.model';
import { RolesModule } from './roles/roles.module';


@Module({
    imports: [
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
                    models: [Role, User],
                    logging: appConfig.logMode === LogMode.Debug,
                };
                return options;
            }
        }),
    ],
})
export class AppModule { }