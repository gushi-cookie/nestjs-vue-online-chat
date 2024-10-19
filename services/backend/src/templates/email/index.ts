import { LocalizationService } from 'src/localization/localization.service';
import { RenderWrap, Template, TemplateDelegates } from '../templates.interface';
import merge from 'deepmerge';
import * as templateUtil from '../templates.util';
import Handlebars from 'handlebars';


export const emailBaseDir = 'src/templates/email';


export namespace regVerification {
    // Assemble data
    export interface Locale {
        title: string;
        subject: string;
        header: {
            logoAlt: string;
        }
        content: {
            h2: string;
            p: string;
            buttonText: string;
        }
        footer: {
            p: string;
        }
    };

    export interface Dependencies {
        lang: string;
        header: {
            logoSrc: string;
        }
    };

    export type AssembleData = Locale & Dependencies;


    // Render data
    export interface Placeholders {
        nickname: string;
        verifyLink: string;
    };


    // Templates description
    const template: Template = {
        file: 'reg-verification.html.hbs',
        components: [{
            file: 'head.html.hbs',
            name: 'component_head',
            compile: true,
            components: [{
                file: 'style.css',
                name: 'component_style',
                compile: false,
                components: [],
            }],
        }, {
            file: 'footer.html.hbs',
            name: 'component_footer',
            compile: true,
            components: [],
        }],
    };


    const plainTemplate: Template = {
        file: 'reg-verification.plain.hbs',
        components: [],
    };


    // Delegates preparation
    const localeContext = 'email.regVerification';
    const preparedHtmlDelegates = new Map<string, TemplateDelegates>();
    const preparedPlainDelegates = new Map<string, TemplateDelegates>();

    async function _prepareTemplates(logoSrc: string, type: 'html' | 'plain'): Promise<number> {
        let contextWrap;
        let deps: Dependencies;
        let assembleData: AssembleData;
        let preparedTemplate;
        let preparedSubject;
        for(let localeCode of localizationService.supportedLocales) {
            contextWrap = localizationService.getLocaleContext(localeCode, localeContext);

            deps = {
                lang: contextWrap.lang,
                header: { logoSrc },
            };

            assembleData = merge(contextWrap.context as Locale, deps);

            preparedSubject = Handlebars.compile((contextWrap.context as Locale).subject);

            if(type === 'html') {
                preparedTemplate = await templateUtil.assembleTemplate(emailBaseDir, template, assembleData);
                preparedHtmlDelegates.set(contextWrap.lang, {
                    subject: preparedSubject,
                    template: Handlebars.compile(preparedTemplate),
                });
            } else {
                preparedTemplate = await templateUtil.assembleTemplate(emailBaseDir, plainTemplate, assembleData);
                preparedPlainDelegates.set(contextWrap.lang, {
                    subject: preparedSubject,
                    template: Handlebars.compile(preparedTemplate),
                });
            }
        }

        return type === 'html' ? preparedHtmlDelegates.size : preparedPlainDelegates.size;
    }

    export async function prepareTemplates(logoSrc: string): Promise<number> {
        let count = await _prepareTemplates(logoSrc, 'html');
        count += await _prepareTemplates(logoSrc, 'plain');
        return count;
    }


    export function renderHtml(placeholders: Placeholders, lang: string): RenderWrap {
        let delegates = preparedHtmlDelegates.get(lang);
        if(!delegates) delegates = preparedHtmlDelegates.get(localizationService.defaultLocale);
        if(!delegates) throw new Error(`Couldn't find a html template.`);

        return {
            subject: delegates.subject(placeholders),
            template: delegates.template(placeholders)
        }
    }

    export function renderPlain(placeholders: Placeholders, lang: string): RenderWrap {
        let delegates = preparedPlainDelegates.get(lang);
        if(!delegates) delegates = preparedPlainDelegates.get(localizationService.defaultLocale);
        if(!delegates) throw new Error(`Couldn't find a plain template.`);

        return {
            subject: delegates.subject(placeholders),
            template: delegates.template(placeholders)
        }
    } 


    // Init stage
    let localizationService: LocalizationService;

    export function init(service: LocalizationService) {
        localizationService = service;
    }
}