import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from 'src/config/constants';


export const mailerProviders: Provider[] = [
    {
        provide: ConfigKey.Mailer,
        useFactory: (configService: ConfigService) => configService.get(ConfigKey.Mailer),
        inject: [ConfigService],
    }
];