import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthenticatedRequest } from '../auth.interface';
import { AuthConfig } from 'src/config/config.types';
import { ConfigKey } from 'src/config/constants';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,

        @Inject(ConfigKey.Auth)
        private config: AuthConfig,
    ) { }


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.config.jwtSecret
            });
            (request as AuthenticatedRequest).user = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}