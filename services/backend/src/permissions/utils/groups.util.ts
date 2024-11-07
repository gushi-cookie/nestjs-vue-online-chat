import { Group } from '../interfaces/group.interface';
import permissionsUtil from './permissions.util';
import { GroupPermission } from '../interfaces/permission-nodes.interface';
import mergeCallbacksUtil from './merge-callbacks.util';
import { arrays } from 'src/common/utils/collection.util';


/**
 * Merge array of groups. Group name is an identifier for separating groups in stacks,
 * according to the passed order. Then groups in each stack are merged together, starting from
 * the first group. On merge conflict, next group of a stack overrides conflicting data.
 * @param groups - groups to merge.
 * @returns array of unique merged groups.
 */
function mergeGroupsArray(...groups: Group[]): Group[] {
    let result: Group[] = [];
    let duplicatesSearchResult = arrays.findDuplicatesByPredicate(groups, (group1, group2) => group1.name === group2.name);

    for(let duplicates of duplicatesSearchResult.duplicates) {
        result.push(arrays.mergeItems(duplicates, (lastMerged, toMerge) => {
            return mergeGroups(lastMerged, toMerge);
        }));
    }

    result.push(...duplicatesSearchResult.unique);
    return result;
}

/**
 * Merge two groups. On conflict, the second group overrides conflicting data.
 * @param group1 - the first group.
 * @param group2 - the second group.
 * @returns merge result of two groups.
 */
function mergeGroups(group1: Group, group2: Group): Group {
    return {
        name: group2.name,
        childGroups: [...new Set([...group1.childGroups, ...group2.childGroups])],
        permissions: permissionsUtil.mergePermissionsArray(
            mergeCallbacksUtil.forGroups, ...group1.permissions, ...group2.permissions
        ),
    };

    // let permissions: GroupPermission[] = [];


    // let perm2;
    // for(let perm1 of group1.permissions) {
    //     perm2 = permissionsUtil.findPermissionByKey(perm1.key, group2.permissions);

    //     if(perm2) {
    //         permissions.push(permissionsUtil.mergePermissions(perm1, perm2, mergeCallbacksUtil.mergeGroupPermissions));
    //     } else {
    //         permissions.push(perm1);
    //     }
    // }

    // let perm1;
    // for(let perm2 of group2.permissions) {
    //     perm1 = permissionsUtil.findPermissionByKey(perm2.key, group2.permissions);

    //     if(perm1 && !permissionsUtil.includesPermissionByKey(perm2.key, permissions)) {
    //         permissions.push(permissionsUtil.mergePermissions(perm1, perm2, mergeCallbacksUtil.mergeGroupPermissions));
    //     } else {
    //         permissions.push(perm2);
    //     }
    // }


    // let childGroups = group1.childGroups.concat(group2.childGroups);
    // childGroups = [...new Set(childGroups)];

    // return { 
    //     name: group2.name,
    //     permissions,
    //     childGroups,
    // };
}


/**
 * Form a permission tree from a keys path.
 * @param path - a static path.
 * @returns base permission of the tree.
 */
function permissionFromPath(path: string[]): GroupPermission {
    let basePermission: GroupPermission = { key: path[0], permissions: [] };
    path = path.slice(1);
    if(path.length <= 0) return basePermission;

    let prevPermission = basePermission;
    let permission: GroupPermission;
    for(let key of path) {
        permission = { key, permissions: [] };
        prevPermission.permissions.push(permission);
        prevPermission = permission;
    }

    return basePermission;
}

/**
 * Check if a groups array includes a group with the specified name.
 * @param name - group name.
 * @param groups - groups array.
 * @returns true if the groups array includes a specific group.
 */
function includesGroupByName(name: string, groups: Group[]): boolean {
    for(let group of groups) {
        if(group.name === name) return true;
    }
    return false;
}

/**
 * Find a group with the specified name in a groups array.
 * @param name - group name.
 * @param groups - groups array.
 * @returns a group or null if not found.
 */
function findGroupByName(name: string, groups: Group[]): Group | null {
    for(let group of groups) {
        if(group.name === name) return group;
    }
    return null;
}


export default {
    mergeGroupsArray,
    mergeGroups,

    permissionFromPath,
    includesGroupByName,
    findGroupByName,
};