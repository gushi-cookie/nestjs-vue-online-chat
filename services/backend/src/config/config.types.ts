import { IsBoolean, IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';
import { PortsRange } from '../common/constants';
import { ConfigObject } from '@nestjs/config';


export enum Environment {
    Production = 'production',
    Development = 'development',
}

export enum LogMode {
    Default = 'default',
    Debug = 'debug',
}


export class MailerConfig implements ConfigObject {
    @IsString()
    host: string;

    @IsNumber()
    @Min(PortsRange.min)
    @Max(PortsRange.max)
    port: number;

    @IsString()
    login: string;

    @IsString()
    password: string;

    @IsBoolean()
    secure: boolean;

    
    static fromRawData(host: any, port: any, login: any, password: any, secure: any): MailerConfig {
        const obj = new MailerConfig();

        obj.host = host;
        obj.port = port;
        obj.login = login;
        obj.password = password;
        obj.secure = secure;

        return obj;
    }
}

export class SQLConfig implements ConfigObject {
    @IsString()
    database: string;

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


    static fromRawData(database: any, host: any, port: any, user: any, password: any): SQLConfig {
        const obj = new SQLConfig();

        obj.database = database;
        obj.host = host;
        obj.port = port;
        obj.user = user;
        obj.password = password;

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
    jwtExpiresIn: string;

    @IsNumber({ allowNaN: false, allowInfinity: false })
    verificationTokenExpiresIn: number;


    static fromRawData(jwtSecret: any, jwtExpiresIn: any, verificationTokenExpiresIn: any): AuthConfig {
        const obj = new AuthConfig();

        obj.jwtSecret = jwtSecret;
        obj.jwtExpiresIn = jwtExpiresIn;
        obj.verificationTokenExpiresIn = verificationTokenExpiresIn;

        return obj;
    }
}