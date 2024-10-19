import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { regVerification } from './email';
import { LocalizationService } from 'src/localization/localization.service';


@Injectable()
export class TemplatesService implements OnModuleInit {
    private logger: Logger;
    public readonly templates = {
        email: {
            regVerification,
        }
    };

    constructor(
        private localizationService: LocalizationService
    ) {
        this.logger = new Logger(TemplatesService.name);
    }


    async onModuleInit() {
        regVerification.init(this.localizationService);
        let count = await regVerification.prepareTemplates(
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/image2.jpg?width=454&name=image2.jpg'
        );
        this.logger.log(`Prepared ${count} templates.`);
    }
}