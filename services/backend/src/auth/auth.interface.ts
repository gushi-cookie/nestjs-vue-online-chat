import { Request } from 'express';


export interface AuthenticatedRequest extends Request {
    payload: JwtPayload;
}

export interface JwtPayload {
    sub: number;
    login: string;
}