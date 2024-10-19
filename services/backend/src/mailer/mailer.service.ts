import { Inject, Injectable } from '@nestjs/common';
import { MailerConfig } from 'src/config/config.types';
import nodemailer from 'nodemailer';
import { PostResult } from './mailer.interface';
import { ConfigKey } from 'src/config/constants';


@Injectable()
export class MailerService {
    private transporter;

    constructor(
        @Inject(ConfigKey.Mailer)
        private mailerConfig: MailerConfig,
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.mailerConfig.host,
            port: this.mailerConfig.port,
            secure: this.mailerConfig.secure,
            auth: {
                user: this.mailerConfig.login,
                pass: this.mailerConfig.password,
            }
        });
    }

    async sendMail(receivers: string[], subject: string, text?: string, html?: string): Promise<PostResult> {
        return await this.transporter.sendMail({
            from: this.mailerConfig.login,
            to: receivers.join(', '),
            subject, text, html
        }) as PostResult;
    }
}