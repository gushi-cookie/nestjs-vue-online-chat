import { Provider } from '@nestjs/common';
import { ConfigKey } from './config/constants';
import { ConfigService } from '@nestjs/config';


export const singleProviders: Record<string, Provider> = {
    mongoConfig: {
        provide: ConfigKey.Mongo,
        useFactory: (configService: ConfigService) => configService.get(ConfigKey.Mongo),
        inject: [ConfigService],
    },
    appConfig: {
        provide: ConfigKey.App,
        useFactory: (configService: ConfigService) => configService.get(ConfigKey.App),
        inject: [ConfigService],
    }
};

export const appProviders: Provider[] = Object.values(singleProviders);