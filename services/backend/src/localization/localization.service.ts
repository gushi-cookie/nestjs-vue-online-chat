import { Injectable } from '@nestjs/common';
import * as locales from './locales';
import { LocaleContextWrap, LocaleLanguage, LocaleWrap } from './localization.interface';
import dot from 'dot-object';



@Injectable()
export class LocalizationService {
    public readonly defaultLocale: LocaleLanguage = 'en';
    public readonly supportedLocales: string[] = Object.keys(locales);


    /**
     * Get specific locale.
     * @param locale - ISO_639-1 code.
     * @returns - specified locale or default if not found.
     */
    getLocale(locale: string): LocaleWrap {
        if(this.supportedLocales.includes(locale)) {
            return {
                lang: locale as LocaleLanguage,
                locale: locales[locale as LocaleLanguage],
            }
        } else {
            return {
                lang: this.defaultLocale,
                locale: locales[this.defaultLocale],
            }
        }
    }

    /**
     * Get specific object from the locale, by dot path.
     * @param locale - ISO_639-1 code.
     * @param context - dot path to the object.
     * @returns - specified locale's context object. If locale not found the default one is used.
     */
    getLocaleContext(locale: string, context: string): LocaleContextWrap {
        let wrap = this.getLocale(locale);
        let obj =  dot.pick(context, wrap.locale);

        if(!(obj instanceof Object)) {
            throw new Error(`Couldn't resolve context object of '${locale}' locale. Got: '${obj}'`);
        } else {
            return {
                lang: wrap.lang,
                context: obj,
            }
        }
    }
}