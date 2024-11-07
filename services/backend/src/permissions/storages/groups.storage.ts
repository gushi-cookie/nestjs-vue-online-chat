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
        let newGroups = groupsUtil.mergeGroupsArray(...this.groups, ...groups);
        newGroups = newGroups.sort((group1, group2) => group1.name.localeCompare(group2.name));

        this.groups = newGroups;
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
}