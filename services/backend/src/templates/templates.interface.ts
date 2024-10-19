/**
 * Component description.
 */
export interface Component {
    file: string;
    name: string;
    compile: boolean;
    components: Component[];
}

/**
 * Template description.
 */
export interface Template {
    file: string;
    components: Component[];
}

/**
 * Pre-render templates.
 */
export interface TemplateDelegates {
    subject: HandlebarsTemplateDelegate;
    template: HandlebarsTemplateDelegate;
}

/**
 * Rendered templates.
 */
export interface RenderWrap {
    subject: string;
    template: string;
}