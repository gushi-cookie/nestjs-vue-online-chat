import { LocalizationService } from 'src/localization/localization.service';
import { RenderedTemplate, Template, PreparedTemplate } from '../templates.interface';
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
    const htmlTemplate: Template = {
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


    // Templates preparation
    const localeContext = 'email.regVerification';
    const preparedHtmlTemplates = new Map<string, PreparedTemplate>();
    const preparedPlainTemplates = new Map<string, PreparedTemplate>();

    async function _prepareTemplates(logoSrc: string, type: 'html' | 'plain'): Promise<number> {
        let contextWrap;
        let deps: Dependencies;
        let assembleData: AssembleData;
        let subject;
        for(let localeCode of localizationService.supportedLocales) {
            contextWrap = localizationService.getLocaleContext(localeCode, localeContext);

            deps = {
                lang: contextWrap.lang,
                header: { logoSrc },
            };

            assembleData = merge(contextWrap.context as Locale, deps);

            subject = Handlebars.compile((contextWrap.context as Locale).subject, templateUtil.handlebarsOptions)(assembleData);

            if(type === 'html') {
                preparedHtmlTemplates.set(contextWrap.lang, {
                    subject,
                    template: await templateUtil.assembleTemplate(emailBaseDir, htmlTemplate, assembleData)
                });
            } else {
                preparedPlainTemplates.set(contextWrap.lang, {
                    subject,
                    template: await templateUtil.assembleTemplate(emailBaseDir, plainTemplate, assembleData)
                });
            }
        }

        return type === 'html' ? preparedHtmlTemplates.size : preparedPlainTemplates.size;
    }

    export async function prepareTemplates(logoSrc: string): Promise<number> {
        let count = await _prepareTemplates(logoSrc, 'html');
        count += await _prepareTemplates(logoSrc, 'plain');
        return count;
    }


    export function renderHtml(placeholders: Placeholders, lang: string): RenderedTemplate {
        let template = preparedHtmlTemplates.get(lang);
        if(!template) template = preparedHtmlTemplates.get(localizationService.defaultLocale);
        if(!template) throw new Error(`Couldn't find a html template.`);

        return {
            subject: templateUtil.populatePlaceholders(template.subject, placeholders),
            template: templateUtil.populatePlaceholders(template.template, placeholders),
        }
    }

    export function renderPlain(placeholders: Placeholders, lang: string): RenderedTemplate {
        let template = preparedPlainTemplates.get(lang);
        if(!template) template = preparedPlainTemplates.get(localizationService.defaultLocale);
        if(!template) throw new Error(`Couldn't find a plain template.`);

        return {
            subject: templateUtil.populatePlaceholders(template.subject, placeholders),
            template: templateUtil.populatePlaceholders(template.template, placeholders),
        }
    }


    // Init stage
    let localizationService: LocalizationService;

    export function init(service: LocalizationService) {
        localizationService = service;
    }
}