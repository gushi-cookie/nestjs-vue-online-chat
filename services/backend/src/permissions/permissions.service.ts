import { Injectable, Logger } from '@nestjs/common';
import { UserAbilities } from './interfaces/user-abilities.interface';
import userAbilitiesUtil from './utils/user-abilities.util';
import { GroupsStorage } from './storages/groups.storage';
import permissionsUtil from './utils/permissions.util';


@Injectable()
export class PermissionsService {
    private logger: Logger = new Logger(PermissionsService.name);


    /**
     * Check if user abilities are authorized with a specific permission.
     * @param staticPath - a static path of the permission.
     * @param abilities - a user abilities instance.
     * @returns true if abilities are authorized.
     */
    isAuthorized(staticPath: string, abilities: UserAbilities): boolean {
        let path = staticPath.split('.');

        if(path.length === 0) {
            throw new Error(`Path must contain at least 1 fragment.`);
        } else if(path[0] === '*' || path[path.length - 1] === '*') {
            throw new Error(`Static paths aren't allowed to contain wildcards.`);
        }


        let permission = userAbilitiesUtil.findActivePermission(path, abilities);
        if(permission) {
            if(permission.wildcard !== null) {
                return permission.wildcard;
            } else if(permission.positive !== null) {
                return permission.positive;
            } else {
                throw new Error(`Permission '${permission.key}' is intermediate and cannot be used for authorization.`);
            }
        }


        let group;
        for(let name of abilities.groups) {
            group = GroupsStorage.getGroup(name);
            if(!group) {
                this.logger.warn(`Permission group '${name}' not found in the storage.`);
                continue;
            } else if(GroupsStorage.hasPermissionByPath(staticPath, group)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Find a user permission's arguments in a user abilities, by a static path.
     * @param staticPermissionPath - a static path of the permission.
     * @param abilities - a user abilities instance.
     * @returns arguments or null if not found.
     */
    findUserPermissionArgumentsByPath(staticPermissionPath: string, abilities: UserAbilities): object[] | null {
        let permission = permissionsUtil.findNestedPermission(staticPermissionPath.split('.'), abilities.permissions);
        if(!permission || !permission.arguments) return null;
        return permission.arguments;
    }
}