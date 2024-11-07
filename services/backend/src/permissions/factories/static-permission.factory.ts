import { StaticPermission } from '../interfaces/permission-nodes.interface';


export class StaticPermissionFactory {
    private permission: StaticPermission;

    constructor(key: string) {
        this.permission = {
            key,
            requiredParams: [],
            optionalParams: [],
            permissions: [],
        }
    }


    static fromKey(key: string): StaticPermission {
        return {
            key,
            requiredParams: [],
            optionalParams: [],
            permissions: [],
        }
    }

    setParent(parent: StaticPermission): StaticPermissionFactory {
        parent.permissions.push(this.permission);
        return this;
    }

    addChildPermission(perm: StaticPermission): StaticPermissionFactory {
        this.permission.permissions.push(perm);
        return this;
    }

    addChildPermissions(perms: StaticPermission[]): StaticPermissionFactory {
        for(let perm of perms) {
            this.permission.permissions.push(perm);
        }
        return this;
    }

    addRequiredParam(name: string): StaticPermissionFactory {
        this.permission.requiredParams.push(name);
        return this;
    }

    addOptionalParam(name: string): StaticPermissionFactory {
        this.permission.optionalParams.push(name);
        return this;
    }

    build(): StaticPermission {
        return this.permission;
    }
}