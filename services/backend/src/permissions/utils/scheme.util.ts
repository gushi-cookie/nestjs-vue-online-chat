import { modules } from 'src/common/esm-modules';
import { PermissionsTreeScheme } from '../interfaces/permissions-tree-scheme';
const { kebabCase } = modules.changeCase;


/**
 * Mutate values of a scheme object by associating them with the scheme's properties.
 * For embedded scheme objects (that are also)
 * @param basePrefix - base/root prefix.
 * @param scheme - scheme object.
 */
export function assembleScheme(basePrefix: string, scheme: PermissionsTreeScheme) {
    basePrefix = kebabCase(basePrefix);
    scheme._path = basePrefix;


    let prefix;
    let value;
    for(let property of Object.getOwnPropertyNames(scheme)) {
        prefix = `${basePrefix}.${kebabCase(property)}`;
        value = scheme[property];

        if(typeof value === 'string') {
            scheme[property] = prefix;
        } else if(typeof value === 'object') {
            value._path = prefix;
            assembleScheme(prefix, value);
        } else {
            throw new Error(`Type '${typeof value}' of '${property}' property not supported.`);
        }
    }
}