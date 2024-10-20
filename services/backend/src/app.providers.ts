import { Provider } from '@nestjs/common';
import { ConfigKey } from './config/constants';
import { ConfigService } from '@nestjs/config';


export const appProviders: Provider[] = [
    {
        provide: ConfigKey.App,
        useFactory: (configService: ConfigService) => configService.get(ConfigKey.App),
        inject: [ConfigService],
    }
];