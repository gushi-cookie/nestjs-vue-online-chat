import { UserPermission } from '../interfaces/permission-nodes.interface';
import { UserAbilities } from '../interfaces/user-abilities.interface';
import permissionsUtil from './permissions.util';


/**
 * Find a user permission, from the end, that has influence on the path permission.
 * @param staticPath - a keys chain of the permission.
 * @param abilities - abilities of a user.
 * @returns a permission or null if not found.
 */
function findActivePermission(staticPath: string[], abilities: UserAbilities): UserPermission | null {
    let basePermission = permissionsUtil.findPermissionByKey(staticPath[0], abilities.permissions);
    if(!basePermission) return null;

    staticPath = staticPath.slice(1);
    if(staticPath.length <= 0) {
        if(typeof basePermission.wildcard !== 'boolean' || typeof basePermission.positive !== 'boolean') {
            return null;
        } else {
            return basePermission;
        }
    }


    let permission: UserPermission | null = basePermission;
    for(let key of staticPath) {
        permission = permissionsUtil.findPermissionByKey(key, permission.permissions.reverse());

        if(!permission) {
            return null;
        } else if(typeof permission.wildcard === 'boolean' || typeof permission.positive === 'boolean') {
            return permission;
        } else {
            return null;
        }
    }

    return permission;
}

export default {
    findActivePermission,
};