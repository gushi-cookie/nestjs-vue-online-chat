import { LocalizationService } from 'src/localization/localization.service';
import { Template } from '../templates.interface';
import merge from 'deepmerge';
import * as templateUtil from '../templates.util';
import Handlebars from 'handlebars';


export const emailBaseDir = 'src/templates/email';


export namespace regVerification {
    // Assemble data
    export interface Locale {
        title: string;
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


    // Templates preparation
    const localeContext = 'email.regVerification';
    const preparedHtmlTemplates = new Map<string, HandlebarsTemplateDelegate>();
    const preparedPlainTemplates = new Map<string, HandlebarsTemplateDelegate>();

    async function _prepareTemplates(logoSrc: string, type: 'html' | 'plain'): Promise<number> {
        let contextWrap;
        let deps: Dependencies;
        let assembleData: AssembleData;
        let preparedTemplate;
        for(let localeCode of localizationService.supportedLocales) {
            contextWrap = localizationService.getLocaleContext(localeCode, localeContext);

            deps = {
                lang: contextWrap.lang,
                header: { logoSrc },
            };

            assembleData = merge(contextWrap.context as Locale, deps);

            
            if(type === 'html') {
                preparedTemplate = await templateUtil.assembleTemplate(emailBaseDir, template, assembleData);
                preparedHtmlTemplates.set(
                    contextWrap.lang,
                    Handlebars.compile(preparedTemplate)
                );
            } else {
                preparedTemplate = await templateUtil.assembleTemplate(emailBaseDir, plainTemplate, assembleData);
                preparedPlainTemplates.set(
                    contextWrap.lang,
                    Handlebars.compile(preparedTemplate)
                );
            }
            
        }
        return prepareTemplates.length;
    }

    export async function prepareTemplates(logoSrc: string): Promise<number> {
        let count = await _prepareTemplates(logoSrc, 'html');
        count += await _prepareTemplates(logoSrc, 'plain');
        return count;
    }


    export function renderHtml(placeholders: Placeholders, lang: string): string {
        let template = preparedHtmlTemplates.get(lang);
        if(!template) template = preparedHtmlTemplates.get(localizationService.defaultLocale);
        if(!template) throw new Error(`Couldn't find a html template.`);

        return template(placeholders);
    }

    export function renderPlain(placeholders: Placeholders, lang: string): string {
        let template = preparedPlainTemplates.get(lang);
        if(!template) template = preparedHtmlTemplates.get(localizationService.defaultLocale);
        if(!template) throw new Error(`Couldn't find a plain template.`);

        return template(placeholders);
    } 


    // Init stage
    let localizationService: LocalizationService;

    export function init(service: LocalizationService) {
        localizationService = service;
    }
}