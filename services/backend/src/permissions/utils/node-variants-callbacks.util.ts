import { GroupPermission, StaticPermission, UserPermission } from '../interfaces/permission-nodes.interface';
import { FormNodeVariantsCallback } from './permissions.util';


const forGroup: FormNodeVariantsCallback<GroupPermission> = function(permission) {
    return [];
};

const forStatic: FormNodeVariantsCallback<StaticPermission> = function(permission) {
    let params = [
        ...permission.requiredParams.map((name) => `<${name}>`),
        ...permission.optionalParams.map((name) => `[${name}]`),
    ].join('.');

    return params.length === 0 ? [] : [params];
};

const forUser: FormNodeVariantsCallback<UserPermission> = function(permission) {
    throw new Error(`TO-DO implement the function.`);
};


export default {
    forGroup,
    forStatic,
    forUser,
};