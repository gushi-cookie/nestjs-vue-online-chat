import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VerificationsService } from './verifications.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { VerificationSession } from './verification-session.model';
import { VerificationsController } from './verifications.controller';


@Module({
    imports: [
        SequelizeModule.forFeature([VerificationSession]),
        ConfigModule,
    ],
    providers: [VerificationsService],
    exports: [VerificationsService],
    controllers: [VerificationsController],
})
export class VerificationsModule {}