import { Group } from '../interfaces/group.interface';
import { GroupPermission } from '../interfaces/permission-nodes.interface';
import groupsUtil from '../utils/groups.util';


export class GroupFactory {
    private group: Group;

    constructor(name: string) {
        this.group = {
            name,
            permissions: [],
            childGroups: [],
        };
    }


    addParentGroup(group: Group): GroupFactory {
        if(!group.childGroups.includes(this.group.name)) {
            group.childGroups.push(this.group.name);
        }
        return this;
    }

    addParentGroups(parentGroups: Group[]): GroupFactory {
        for(let group of parentGroups) {
            this.addParentGroup(group);
        }
        return this;
    }

    /**
     * Add group permission from an object or a dot-notation string.
     * @param perm - object or dot-notation string of a static permission.
     * @returns chain.
     */
    addPermission(perm: GroupPermission | string): GroupFactory {
        let basePermission = typeof perm === 'string' ? groupsUtil.permissionFromPath(perm.split('.')) : perm;

        // TO-DO merge processes.
        this.group.permissions.push(basePermission);

        return this;
    }

    addPermissions(perms: GroupPermission[] | string[]): GroupFactory {
        for(let perm of perms) {
            this.addPermission(perm);
        }
        return this;
    }

    build(): Group {
        return this.group;
    }
}