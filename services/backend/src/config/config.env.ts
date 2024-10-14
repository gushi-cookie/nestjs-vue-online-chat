import { AppConfig, AuthConfig, SQLConfig } from './config.types';


export const rawAppConfig = AppConfig.fromRawData(
    process.env['NODE_ENV'],
    process.env['APP_PORT'],
    process.env['LOG_MODE'],
);

export const rawSQLConfig = SQLConfig.fromRawData(
    process.env['POSTGRES_DATABASE'],
    process.env['POSTGRES_HOST'],
    process.env['POSTGRES_PORT'],
    process.env['POSTGRES_USER'],
    process.env['POSTGRES_PASSWORD'],
);

export const rawAuthConfig = AuthConfig.fromRawData(
    process.env['JWT_SECRET'],
    process.env['JWT_EXPIRES_IN'],
);