import { SessionType } from './constants';


export interface SessionData {
    readonly userId: number;
}

export interface UserRegistrationData extends SessionData { }

export interface PasswordChangeData extends SessionData {
    newPassword: string;
}

export interface SessionMeta {
    readonly type: SessionType;
    readonly eventName: string;
    readonly perUserLimit: number;
}