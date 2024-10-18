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


    // Template description
    export const template: Template = {
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


    // Delegates preparation
    const preparedTemplates = new Map<string, HandlebarsTemplateDelegate>();

    export async function prepareTemplates(logoSrc: string): Promise<number> {
        let contextWrap;
        let deps: Dependencies;
        let assembleData: AssembleData;
        let template;
        for(let localeCode of localizationService.supportedLocales) {
            contextWrap = localizationService.getLocaleContext(localeCode, 'email.regVerification');

            deps = {
                lang: contextWrap.lang,
                header: { logoSrc },
            };

            assembleData = merge(contextWrap.context as Locale, deps);

            template = await templateUtil.assembleTemplate(emailBaseDir, regVerification.template, assembleData);
            preparedTemplates.set(
                contextWrap.lang,
                Handlebars.compile(template)
            );
        }
        return prepareTemplates.length;
    }

    export async function render(placeholders: Placeholders, lang: string): Promise<string> {
        let template = preparedTemplates.get(lang);
        if(!template) template = preparedTemplates.get(localizationService.defaultLocale);
        if(!template) throw new Error(`Couldn't find a template.`);

        return template(placeholders);
    }


    // Init stage
    let localizationService: LocalizationService;

    export function init(service: LocalizationService) {
        localizationService = service;
    }
}