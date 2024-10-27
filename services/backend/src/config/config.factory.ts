import { registerAs } from '@nestjs/config';
import { AppConfig, AuthConfig, MailerConfig, MongoConfig, SQLConfig } from './config.types';
import { validateAppConfig, validateSQLConfig, validateAuthConfig, validateMailerConfig, validateMongoConfig } from './config.validation';
import { rawAppConfig, rawSQLConfig, rawAuthConfig, rawMailerConfig, rawMongoConfig } from './config.env';
import { ConfigKey } from './constants';


const appConfigFactory = registerAs<AppConfig>(ConfigKey.App, () => {
    return validateAppConfig(rawAppConfig);
});

const sqlConfigFactory = registerAs<SQLConfig>(ConfigKey.SQL, () => {
    return validateSQLConfig(rawSQLConfig);
});

const authConfigFactory = registerAs<AuthConfig>(ConfigKey.Auth, () => {
    return validateAuthConfig(rawAuthConfig);
});

const mailerConfigFactory = registerAs<MailerConfig>(ConfigKey.Mailer, () => {
    return validateMailerConfig(rawMailerConfig);
});

const mongoConfigFactory = registerAs<MongoConfig>(ConfigKey.Mongo, () => {
    return validateMongoConfig(rawMongoConfig);
});


export default [appConfigFactory, sqlConfigFactory, authConfigFactory, mailerConfigFactory, mongoConfigFactory];