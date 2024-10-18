import { regVerification } from 'src/templates/email';
import * as locales from './locales';


export interface Locale {
    email: {
        // Placeholders: (nickname, verifyLink)
        regVerification: regVerification.Locale;
    }
}

export interface LocaleWrap {
    lang: LocaleLanguage;
    locale: Locale;
}

export interface LocaleContextWrap {
    lang: LocaleLanguage;
    context: object;
}


export type LocaleLanguage = keyof typeof locales;