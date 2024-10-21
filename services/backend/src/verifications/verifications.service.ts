import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuthConfig } from 'src/config/config.types';
import { ConfigKey } from 'src/config/constants';
import { VerificationSession } from './verification-session.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreationException, SessionType, VerificationResult, sessionsMeta } from './constants';
import { SessionData } from './verifications.interface';
import { queryEmptyOptions } from 'src/common/utils/sequelize.util';
import { importNanoid, nanoidType } from 'src/common/esm-modules';
let nanoid: nanoidType['nanoid'];


@Injectable()
export class VerificationsService implements OnModuleInit {
    constructor(
        private eventEmitter: EventEmitter2,

        @Inject(ConfigKey.Auth)
        private authConfig: AuthConfig,

        @InjectModel(VerificationSession)
        private verificationSession: typeof VerificationSession,
    ) {}

    async onModuleInit() {
        nanoid = (await importNanoid()).nanoid;
    }


    // #####################
    // # Primary interface #
    // #####################
    async createSession(data: SessionData, type: SessionType): Promise<string | CreationException> {
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
        } else if(session.isExpired(this.authConfig.verificationTokenExpiresIn)) {
            await session.destroy({ force: true });
            return VerificationResult.Expired;
        }

        const sessionMeta = sessionsMeta.getMeta(session.type);
        if(!sessionMeta) throw new Error(`Session meta couldn't be found for session type '${session.type}'. Session id '${session.id}'.`);


        this.eventEmitter.emit(sessionMeta.eventName, JSON.parse(session.data));
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