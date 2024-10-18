import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { LocalizationModule } from 'src/localization/localization.module';


@Module({
    imports: [LocalizationModule],
    providers: [TemplatesService],
    exports: [TemplatesService],
})
export class TemplatesModule {}