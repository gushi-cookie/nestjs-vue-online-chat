import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { regVerification } from './email';
import { LocalizationService } from 'src/localization/localization.service';


@Injectable()
export class TemplatesService implements OnApplicationBootstrap {
    constructor(
        private localizationService: LocalizationService
    ) {}


    async onApplicationBootstrap() {
        regVerification.init(this.localizationService);
        await regVerification.prepareTemplates('https://logo.src.com');
    }

    public readonly templates = {
        email: {
            regVerification,
        }
    };
}