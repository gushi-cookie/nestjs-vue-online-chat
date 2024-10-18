import { registerAs } from '@nestjs/config';
import { AppConfig, AuthConfig, MailerConfig, SQLConfig } from './config.types';
import { validateAppConfig, validateSQLConfig, validateAuthConfig, validateMailerConfig } from './config.validation';
import { rawAppConfig, rawSQLConfig, rawAuthConfig, rawMailerConfig } from './config.env';
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


export default [appConfigFactory, sqlConfigFactory, authConfigFactory, mailerConfigFactory];