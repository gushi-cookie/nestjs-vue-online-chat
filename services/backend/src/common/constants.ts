import { LogLevel } from '@nestjs/common';
import { LogMode } from 'src/config/config.types';


/**
 * https://docs.nestjs.com/techniques/logger#basic-customization
 */
export class LogModes {
    public static readonly default: LogLevel[] = ['log', 'fatal', 'error', 'warn'];
    public static readonly debug: LogLevel[] = ['log', 'fatal', 'error', 'warn', 'debug'];

    public static getMode(mode: LogMode): LogLevel[] {
        return LogModes[mode];
    }
}


export enum PortsRange {
    min = 0,
    max = 65535,
}