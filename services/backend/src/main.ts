import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/config.types';
import { ConfigKey } from './config/constants';
import { LogModes } from './common/constants';


async function bootstrap(): Promise<string> {
    let logLevels: LogLevel[] = LogModes.default;
    const nest = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
        logger: logLevels
    });


    const appConfig = nest.get(ConfigService).get<AppConfig>(ConfigKey.App);
    if(!appConfig) throw new Error(`AppConfig is ${appConfig}.`);

    logLevels = LogModes.getMode(appConfig.logMode);
    nest.useGlobalPipes(new ValidationPipe());
    await nest.listen(appConfig.port);
    return await nest.getUrl();
}


(async () => {
    try {
        const url = await bootstrap();
        Logger.log(url, 'Bootstrap');
    } catch(error) {
        Logger.error(error, 'Bootstrap');
    }
})();