import { Controller, HttpCode, HttpStatus, Param, Post, UnauthorizedException } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { VerificationResult } from './constants';


@Controller('verify')
export class VerificationController {
    constructor(
        private verificationsService: VerificationsService,
    ) {}

    
    @HttpCode(HttpStatus.OK)
    @Post(':token')
    async verify(@Param('token') token: string): Promise<string> {
        const session = await this.verificationsService.verifyToken(token);

        if(session === VerificationResult.Expired) {
            throw new UnauthorizedException('Token expired.');
        } else if(session === VerificationResult.TokenNotFound) {
            throw new UnauthorizedException('Invalid token.');
        } else {
            return 'Verified';
        }
    }
}