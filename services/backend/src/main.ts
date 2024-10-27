import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/config.types';
import { ConfigKey } from './config/constants';
import { LogModes } from './common/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap(): Promise<string> {
    let logLevels: LogLevel[] = LogModes.default;
    const nest = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
        logger: logLevels,
    });
    nest.setGlobalPrefix('api');

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Online chat')
        .setDescription('Api of the online chat.')
        .setVersion('1.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(nest, swaggerConfig);
    SwaggerModule.setup('swagger', nest, documentFactory, {
        jsonDocumentUrl: 'swagger/json',
        useGlobalPrefix: true,
    });

    
    const appConfig = nest.get(ConfigService).get<AppConfig>(ConfigKey.App);
    if(!appConfig) throw new Error(`AppConfig is ${appConfig}.`);

    logLevels = LogModes.getMode(appConfig.logMode);
    nest.useGlobalPipes(new ValidationPipe({ transformOptions: {
        enableImplicitConversion: true,
    } }));
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