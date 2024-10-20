/**
 * Component description.
 */
export interface Component {
    file: string;
    name: string;

    /** Should component be compiled by Handlebars at assemble process. */
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
export interface PreparedTemplate {
    subject: string;
    template: string;
}

/**
 * Rendered templates.
 */
export interface RenderedTemplate {
    subject: string;
    template: string;
}