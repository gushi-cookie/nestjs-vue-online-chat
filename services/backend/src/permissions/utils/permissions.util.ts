import { arrays } from 'src/common/utils/collection.util';
import { PermissionNode } from '../interfaces/permission-nodes.interface';



/**
 * Function that merges special data of T type but not PermissionNode's data (key, permissions).
 */
export interface MergeNodesCallback<T> {
    (first: T, second: T): T;
}

/**
 * 
 * @param mergeNodes 
 * @param permissions 
 * @returns 
 */
function mergePermissionsArray<T extends PermissionNode>(mergeNodes: MergeNodesCallback<T>, ...permissions: T[]): T[] {
    let result: T[] = [];
    let duplicatesSearchResult = arrays.findDuplicatesByPredicate(permissions, (perm1, perm2) => perm1.key === perm2.key);

    for(let duplicates of duplicatesSearchResult.duplicates) {
        result.push(arrays.mergeItems(duplicates, (lastMerged: T, toMerge: T) => {
            return mergePermissions(lastMerged, toMerge, mergeNodes);
        }));
    }

    result.push(...duplicatesSearchResult.unique);
    return result;
}

/**
 * Merge two permission nodes.
 * @param first - first node.
 * @param second - second node.
 * @param mergeNodes - function for merging special data of T type.
 * @returns merged permission node.
 */
function mergePermissions<T extends PermissionNode>(first: T, second: T, mergeNodes: MergeNodesCallback<T>): T {
    let basePermission = mergeNodes(first, second);
    basePermission.key = second.key;
    basePermission.permissions = mergePermissionsArray(mergeNodes, ...first.permissions as T[], ...second.permissions as T[]);
    return basePermission;

    // let perm2;
    // for(let perm1 of first.permissions) {
    //     perm2 = findPermissionByKey(perm1.key, second.permissions);

    //     if(perm2) {
    //         basePermission.permissions.push(mergePermissions(perm1, perm2, mergeNodes));
    //     } else {
    //         basePermission.permissions.push(...perm1.permissions);
    //     }
    // }

    // let perm1;
    // for(let perm2 of second.permissions) {
    //     perm1 = findPermissionByKey(perm2.key, first.permissions);

    //     if(perm1 && !includesPermissionByKey(perm2.key, basePermission.permissions)) {
    //         basePermission.permissions.push(mergePermissions(perm1, perm2, mergeNodes));
    //     } else {
    //         basePermission.permissions.push(...perm2.permissions);
    //     }
    // }

    // return basePermission;
}



/**
 * Check if permissions array contains a permission by the key.
 * @param key - key of the searched permission.
 * @param permissions - permissions array.
 * @returns true if permission is included.
 */
function includesPermissionByKey<T extends PermissionNode>(key: string, permissions: T[]): boolean {
    for(let perm of permissions) {
        if(perm.key === key) return true;
    }
    return false;
}

/**
 * Check if a permissions array contains a nested permission.
 * @param path - keys path to the nested permission.
 * @param permissions - permissions array.
 * @returns true if permission exists on path.
 */
function includesNestedPermission<T extends PermissionNode>(path: string[], permissions: T[]): boolean {
    let perm = findNestedPermission(path, permissions);
    return perm !== null;
}



/**
 * Find a permission in a permissions array by key.
 * @param key - permission key.
 * @param permissions - permissions array.
 * @returns permission or null if not found.
 */
function findPermissionByKey<T extends PermissionNode>(key: string, permissions: T[]): T | null {
    for(let perm of permissions) {
        if(perm.key === key) return perm;
    }
    return null;
}

/**
 * Find an embedded permission or return a minimal valid path.
 * @param path - path to the embedded permission.
 * @param permissions - permissions array.
 * @returns permission or minimal valid path.
 */
function findNestedPermissionOrValidPath<T extends PermissionNode>(path: string[], permissions: T[]): T | string {
    let basePermission = findPermissionByKey(path[0], permissions);
    if(!basePermission) return '';

    if(path.length < 2) return basePermission;
    let validPath = [path[0]];
    path.slice(1);


    let permission: T | null = basePermission;
    for(let key of path) {
        permission = findPermissionByKey(key, permission.permissions as (T[]));
        if(!permission) return validPath.join('.');
        validPath.push(key);
    }

    return permission ? permission : validPath.join('.');
}

/**
 * Find an embedded permission in a permissions array by keys path.
 * @param path - keys path to the embedded permission.
 * @param permissions - permissions array.
 * @returns permission or null if not found.
 */
function findNestedPermission<T extends PermissionNode>(path: string[], permissions: T[]): T | null {
    let result = findNestedPermissionOrValidPath(path, permissions);
    return typeof result === 'string' ? null : result;
}



/**
 * Sort nested permissions of every passed permission, by key.
 * 
 * Note that the function mutates passed permissions. Use
 * structuredClone() function to clone permission nodes.
 * @param array - list of permissions to sort.
 */
function sortPermissionsArray<T extends PermissionNode>(...array: T[]) {
    for(let permission of array) {
        sortPermission(permission);
    }
}

/**
 * Sort nested permissions of a passed permission, by key.
 * 
 * Note that the function mutates passed permissions. Use
 * structuredClone() function to clone permission nodes.
 * @param permission - permission to sort.
 */
function sortPermission<T extends PermissionNode>(permission: T) {
    permission.permissions.sort((a, b) => a.key.localeCompare(b.key));

    for(let childPermission of permission.permissions) {
        sortPermission(childPermission);
    }
}



export interface FormNodeVariantsCallback<T> {
    (permission: T): string[];
}

function formAvailablePaths<T extends PermissionNode>(formVariants: FormNodeVariantsCallback<T>, permission: T): string[] {
    return _formAvailablePaths('', formVariants, permission);
}

function _formAvailablePaths<T extends PermissionNode>(prefix: string, formVariants: FormNodeVariantsCallback<T>, permission: T): string[] {
    let result: string[] = [];
    prefix = prefix.length === 0 ? permission.key : `${prefix}.${permission.key}`;
    result.push(prefix);
    
    for(let variant of formVariants(permission)) {
        result.push(`${prefix}.${variant}`);
    }

    for(let nested of permission.permissions) {
        result.push(..._formAvailablePaths(prefix, formVariants, nested as T));
    }

    return result;
}



export default {
    mergePermissionsArray,
    mergePermissions,

    includesPermissionByKey,
    includesNestedPermission,

    findPermissionByKey,
    findNestedPermissionOrValidPath,
    findNestedPermission,

    sortPermissionsArray,
    sortPermission,

    formAvailablePaths,
};