import { Group } from '../interfaces/group.interface';
import groupsUtil from '../utils/groups.util';
import permissionsUtil from '../utils/permissions.util';


export class GroupsStorage {
    private static groups: Group[] = [{
        name: 'default',
        permissions: [],
        childGroups: [],
    }];


    static addGroups(groups: Group[]) {
        this.groups = groupsUtil.mergeGroupsArray(...this.groups, ...groups);
    }

    static getGroup(name: string): Group | null {
        for(let group of this.groups) {
            if(group.name === name) return group;
        }
        return null;
    }

    static hasPermissionByPath(staticPath: string, group: Group): boolean {
        return permissionsUtil.includesNestedPermission(staticPath.split('.'), group.permissions);
    }

    static getGroups(): Group[] {
        return this.groups;
    }

    static countGroups(): number {
        return this.groups.length;
    }

    static getParentGroups(childGroup: Group): Group[] {
        let result: Group[] = [];

        for(let group of this.groups) {
            if(group.childGroups.includes(childGroup.name)) result.push(group);
        }

        return result;
    }
}