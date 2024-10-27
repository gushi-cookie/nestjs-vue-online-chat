import { parseBoolean } from 'src/common/utils/string.util';
import { AppConfig, AuthConfig, MailerConfig, MongoConfig, SQLConfig } from './config.types';
import ms from 'ms';


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
    ms(process.env['VERIFICATION_TOKEN_EXPIRES_IN'] as any),
);

export const rawMailerConfig = MailerConfig.fromRawData(
    process.env['MAILER_HOST'],
    process.env['MAILER_PORT'],
    process.env['MAILER_LOGIN'],
    process.env['MAILER_PASSWORD'],
    parseBoolean(process.env['MAILER_SECURE']),
);

export const rawMongoConfig = MongoConfig.fromRawData(
    process.env['MONGO_HOST'],
    process.env['MONGO_PORT'],
    process.env['MONGO_USER'],
    process.env['MONGO_PASSWORD'],
    process.env['MONGO_INITDB'],
);