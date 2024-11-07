import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VerificationSession } from './verification-session.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreationException, SessionType, VerificationResult, sessionsMeta } from './constants';
import { PasswordChangeData, SessionData, UserRegistrationData } from './verifications.interface';
import { queryEmptyOptions } from 'src/common/utils/sequelize.util';
import UserRegistrationVerifiedEvent from './events/user-registration-verified.event';
import PasswordChangeVerifiedEvent from './events/password-change-verified.event';
import { modules } from 'src/common/esm-modules';
const { nanoid } = modules.nanoid;


@Injectable()
export class VerificationsService {
    constructor(
        private eventEmitter: EventEmitter2,

        @InjectModel(VerificationSession)
        private verificationSession: typeof VerificationSession,
    ) {}


    // #####################
    // # Primary interface #
    // #####################
    async createUserRegistrationSession(data: UserRegistrationData): Promise<string | CreationException> {
        return this.createSession(SessionType.Registration, data);
    }

    async createPasswordChangeSession(data: PasswordChangeData): Promise<string | CreationException> {
        return this.createSession(SessionType.PasswordChange, data);
    }

    private async createSession(type: SessionType, data: SessionData): Promise<string | CreationException> {
        const count = await this.countSessionsByUser(data.userId, type);
        const sessionMeta = sessionsMeta.getMeta(type);
        if(!sessionMeta) throw new Error(`Session meta couldn't be found for session type '${type}'.`);
        if(count >= sessionMeta.perUserLimit) return CreationException.SessionsLimitExceeded;

        const token = await this.generateUniqueSessionToken();
        await this.verificationSession.create({ token, data: JSON.stringify(data), type, userId: data.userId, createdAt: Date.now() });
        return token;
    }

    async verifyToken(token: string): Promise<VerificationResult> {
        let session = await this.findSessionByToken(token);
        if(!session) {
            return VerificationResult.TokenNotFound;
            // TO-DO load from config.
        } else if(session.isExpired(300000)) {
            await session.destroy({ force: true });
            return VerificationResult.Expired;
        }

        const sessionMeta = sessionsMeta.getMeta(session.type);
        if(!sessionMeta) throw new Error(`Session meta couldn't be found for session type '${session.type}'. Session id '${session.id}'.`);

        this.eventEmitter.emit(sessionMeta.eventName, this.establishEventClass(sessionMeta.type, JSON.parse(session.data)));
        session.destroy({ force: true });
        return VerificationResult.Verified;
    }

    private async generateUniqueSessionToken(): Promise<string> {
        let token = undefined;
        for(let i = 0; i < 10; i++) {
            token = nanoid(54);
            if(!await this.hasSessionByToken(token)) break;
        }
        if(!token) throw new Error(`Couldn't generate a unique session token.`);
        return token;
    }

    private establishEventClass(sessionType: SessionType, data: SessionData): object {
        if(sessionType === SessionType.Registration) {
            return new UserRegistrationVerifiedEvent(data.userId);
        } else if(sessionType === SessionType.PasswordChange) {
            return new PasswordChangeVerifiedEvent(data.userId, (data as PasswordChangeData).newPassword);
        } else {
            throw new Error(`Session type ${sessionType} not recognized.`);
        }
    }

    createLink(token: string): string {
        // TO-DO
        let url = new URL('verify', 'http://localhost:4000');
        url.searchParams.append('token', token);
        return url.toString();
    }


    // #################
    // # Model queries #
    // #################
    async countSessionsByUser(userId: number, type?: SessionType): Promise<number> {
        let options = queryEmptyOptions.createCountOptions();
        
        if(type) {
            options.where = { userId, type };
        } else {
            options.where = { userId };
        }

        return await this.verificationSession.count(options);
    }

    async hasSessionByToken(token: string): Promise<boolean> {
        return await this.verificationSession.count({
            where: { token }
        }) > 0;
    }

    async hasSessionByUser(userId: number): Promise<boolean> {
        return await this.verificationSession.count({
            where: { userId }
        }) > 0;
    }

    async findSessionByToken(token: string): Promise<VerificationSession | null> {
        return await this.verificationSession.findOne({
            where: { token }
        });
    }
}