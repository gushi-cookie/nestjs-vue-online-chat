import { Component, Template } from './templates.interface';
import path from 'node:path';
import merge from 'deepmerge';
import fs from 'node:fs/promises';
import Handlebars from 'handlebars';


/**
 * Resolve and assemble dependencies of the template.
 * @param baseDir - root dir of the template.
 * @param template - template to assemble.
 * @param data - data of the template and components.
 * @returns - raw template.
 */
export async function assembleTemplate(baseDir: string, template: Template, data: Record<string, any>): Promise<string> {
    let rawTemplate = (await fs.readFile(path.join(baseDir, template.file))).toString();

    let components: Record<string, string> = {};
    for (let component of template.components) {
        components[component.name] = await assembleComponent(baseDir, component, data);
    }

    return Handlebars.compile(rawTemplate)(merge(components, data));
}


/**
 * Resolve and assemble dependencies of the component.
 * @param baseDir - root dir of the component.
 * @param comp - component to assemble.
 * @param data - data of the components.
 * @returns - raw component. 
 */
export async function assembleComponent(baseDir: string, component: Component, data: Record<string, any>): Promise<string> {
    let rawParentComp = (await fs.readFile(path.join(baseDir, component.file))).toString();
    if (!component.compile) return rawParentComp;

    let childComponents: Record<string, string> = {};
    for (let childComponent of component.components) {
        childComponents[childComponent.name] = await assembleComponent(baseDir, childComponent, data);
    }

    return Handlebars.compile(rawParentComp)({ ...childComponents, ...data });
}