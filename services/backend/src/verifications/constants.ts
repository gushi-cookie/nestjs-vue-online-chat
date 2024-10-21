import { SessionMeta } from './verifications.interface';


export enum SessionType {
    Registration = '1',
    PasswordChange = '2',
}

export enum VerificationResult {
    Verified = 'verified',
    Expired = 'expired',
    TokenNotFound = 'token-not-found',
}

export enum CreationException {
    SessionsLimitExceeded = 'sessions-limit-exceeded',
}


export namespace sessionsMeta {
    const metas: SessionMeta[] = [
        {
            type: SessionType.Registration,
            eventName: 'verification.registration',
            perUserLimit: 1,
        },
        {
            type: SessionType.PasswordChange,
            eventName: 'verification.password-change',
            perUserLimit: 1,
        }
    ];

    export function getMeta(type: string): SessionMeta | undefined {
        for(let meta of metas) {
            if(meta.type === type) return meta;
        }
        return undefined;
    }
}