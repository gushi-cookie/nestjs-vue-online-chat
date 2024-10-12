import { plainToInstance } from 'class-transformer';
import { AppConfig, AuthConfig, SQLConfig } from './config.types';
import { validateSync } from 'class-validator';


export function validateAppConfig(rawConfig: AppConfig): AppConfig {
    const config = plainToInstance(AppConfig, rawConfig, {
        enableImplicitConversion: true,
    });


    const errors = validateSync(config, {
        skipMissingProperties: false,
    });

    if(errors.length > 0) {
        throw new Error(errors.toString());
    }
    return config;
}

export function validateSQLConfig(rawConfig: SQLConfig): SQLConfig {
    const config = plainToInstance(SQLConfig, rawConfig, {
        enableImplicitConversion: true,
    });


    const errors = validateSync(config, {
        skipMissingProperties: false,
    });

    if(errors.length > 0) {
        throw new Error(errors.toString());
    }
    return config;
}

export function validateAuthConfig(rawConfig: AuthConfig): AuthConfig {
    const config = plainToInstance(AuthConfig, rawConfig, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(config, {
        skipMissingProperties: false,
    });

    if(errors.length > 0) {
        throw new Error(errors.toString());
    }
    return config;
}