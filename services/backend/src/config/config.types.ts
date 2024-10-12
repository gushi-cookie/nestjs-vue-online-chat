import { IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';
import { PortsRange } from './constants';
import { ConfigObject } from '@nestjs/config';


export enum SQLDialect {
    Postgres = 'postgres',
    MySQL = 'mysql',
    SQLite = 'sqlite',
}

export enum Environment {
    Production = 'production',
    Development = 'development',
}

export enum LogMode {
    Default = 'default',
    Debug = 'debug',
}



export class SQLConfig implements ConfigObject {
    @IsString()
    host: string;

    @IsNumber()
    @Min(PortsRange.min)
    @Max(PortsRange.max)
    port: number;

    @IsString()
    user: string;

    @IsString()
    password: string;

    @IsEnum(SQLDialect)
    dialect: SQLDialect;


    static fromRawData(host: any, port: any, user: any, password: any, dialect: any): SQLConfig {
        const obj = new SQLConfig();

        obj.host = host;
        obj.port = port;
        obj.user = user;
        obj.password = password;
        obj.dialect = dialect;

        return obj;
    }
}

export class AppConfig implements ConfigObject {
    @IsEnum(Environment)
    environment: Environment;

    @IsNumber()
    @Min(PortsRange.min)
    @Max(PortsRange.max)
    port: number;

    @IsEnum(LogMode)
    logMode: LogMode;
    

    static fromRawData(environment: any, port: any, logMode: any): AppConfig {
        const obj = new AppConfig();

        obj.environment = environment;
        obj.port = port;
        obj.logMode = logMode;

        return obj;
    }
}

export class AuthConfig implements ConfigObject {
    @IsString()
    jwtSecret: string;

    @IsString()
    expiresIn: string;

    static fromRawData(jwtSecret: any, expiresIn: any): AuthConfig {
        const obj = new AuthConfig();

        obj.jwtSecret = jwtSecret;
        obj.expiresIn = expiresIn;

        return obj;
    }
}