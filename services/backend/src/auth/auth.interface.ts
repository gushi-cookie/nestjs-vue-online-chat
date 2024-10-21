import { Request } from 'express';
import { SessionData } from 'src/verifications/verifications.interface';


export interface AuthenticatedRequest extends Request {
    user: any;
}

export interface JwtPayload {
    sub: string;
    login: string;
}

export interface SignUpVerificationPayload extends SessionData {}