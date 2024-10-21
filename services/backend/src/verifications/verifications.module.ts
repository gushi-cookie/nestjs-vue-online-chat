import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { VerificationsService } from './verifications.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { VerificationSession } from './verification-session.model';
import { VerificationController } from './verifications.controller';


@Module({
    imports: [
        SequelizeModule.forFeature([VerificationSession]),
        ConfigModule,
        AuthModule,
    ],
    providers: [VerificationsService],
    controllers: [VerificationController],
})
export class VerificationsModule {}