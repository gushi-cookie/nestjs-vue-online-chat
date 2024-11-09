import { StaticPermission } from '../interfaces/permission-nodes.interface';
import permissionsUtil from '../utils/permissions.util';
import mergeCallbacksUtil from '../utils/merge-callbacks.util';


export class StaticPermissionsStorage {
    private static permissions: StaticPermission[] = [];


    static addPermissions(permissions: StaticPermission[]) {
        this.permissions = permissionsUtil.mergePermissionsArray(
            mergeCallbacksUtil.forStatics,
            ...this.permissions, ...permissions
        );
    }

    static hasPermissionByKey(key: string): boolean {
        for(let perm of this.permissions) {
            if(perm.key === key) return true;
        }
        return false;
    }

    static hasPermissionByPath(path: string): boolean {
        let arrPath = path.split('.');
        if(arrPath.length <= 0) throw new Error(`Path should contain at least 1 fragment.`);

        if(arrPath[0] === '*') {
            // TO-DO
        } else if(arrPath[arrPath.length - 1] === '*') {
            // TO-DO
        }

        return permissionsUtil.includesNestedPermission(arrPath, this.permissions);
    }

    static getPermissionByKey(key: string): StaticPermission | null {
        for(let perm of this.permissions) {
            if(perm.key === key) return perm;
        }
        return null;
    }

    static getPermissionByPathOrValidPath(path: string): StaticPermission | string {
        let arrPath = path.split('.');
        if(arrPath.length <= 0) throw new Error(`Path should contain at least 1 fragment.`);

        if(arrPath[0] === '*') {
            // TO-DO
        } else if(arrPath[arrPath.length - 1] === '*') {
            // TO-DO
        }

        return permissionsUtil.findNestedPermissionOrValidPath(arrPath, this.permissions);
    }

    static getPermissionByPath(path: string): StaticPermission | null {
        return permissionsUtil.findNestedPermission(path.split('.'), this.permissions);
    }

    static getPermissions(): StaticPermission[] {
        return this.permissions;
    }

    static countPermissions(): number {
        return this.permissions.length;
    }
}