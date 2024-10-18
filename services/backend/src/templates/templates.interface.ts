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