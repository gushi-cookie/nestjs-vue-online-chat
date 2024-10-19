import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';
import { mailerProviders } from './mailer.providers';


@Module({
    imports: [ConfigModule],
    providers: [MailerService, ...mailerProviders],
    exports: [MailerService, ...mailerProviders],
})
export class MailerModule {}