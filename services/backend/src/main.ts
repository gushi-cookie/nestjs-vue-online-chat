import { Logger as NestLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<string> {
    const nest = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
    });

    await nest.listen(3000);
    return await nest.getUrl();
}


(async () => {
    try {
        const url = await bootstrap();
        NestLogger.log(url, 'Bootstrap');
    } catch(error) {
        NestLogger.error(error, 'Bootstrap');
    }
})();