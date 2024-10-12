import { registerAs } from '@nestjs/config';
import { AppConfig, AuthConfig, SQLConfig } from './config.types';
import { validateAppConfig, validateSQLConfig, validateAuthConfig } from './config.validation';
import { rawAppConfig, rawSQLConfig, rawAuthConfig } from './config.env';
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


export default [appConfigFactory, sqlConfigFactory, authConfigFactory];