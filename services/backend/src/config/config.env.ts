import { AppConfig, AuthConfig, SQLConfig } from './config.types';


export const rawAppConfig = AppConfig.fromRawData(
    process.env['ENVIRONMENT'],
    process.env['APP_PORT'],
    process.env['LOG_MODE'],
);

export const rawSQLConfig = SQLConfig.fromRawData(
    process.env['DATABASE_HOST'],
    process.env['DATABASE_PORT'],
    process.env['DATABASE_USER'],
    process.env['DATABASE_PASSWORD'],
    process.env['DATABASE_DIALECT'],
);

export const rawAuthConfig = AuthConfig.fromRawData(
    process.env['JWT_SECRET'],
    process.env['JWT_EXPIRES_IN'],
);