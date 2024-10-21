import { SessionType } from './constants';


export interface SessionData {
    userId: number;
}

export interface SessionMeta {
    readonly type: SessionType;
    readonly eventName: string;
    readonly perUserLimit: number;
}