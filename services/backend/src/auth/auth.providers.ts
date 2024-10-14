import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigKey } from "src/config/constants";


export const authProviders: Provider[] = [{
    provide: ConfigKey.Auth,
    useFactory: (config: ConfigService) => config.get(ConfigKey.Auth),
    inject: [ConfigService],
}];