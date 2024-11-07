/**
 * Basic data of a permission node.
 */
export interface PermissionNode {
    /** Node key. */
    key: string;

    /** Child permission nodes. */
    permissions: PermissionNode[];
}


/**
 * Data of a group permission node.
 */
export interface GroupPermission extends PermissionNode {
    /** Child permissions. */
    permissions: GroupPermission[];
}


/**
 * Data of a user permission node.
 */
export interface UserPermission extends PermissionNode {
    /** Child permissions */
    permissions: UserPermission[];

    /** Node positiveness and presence. */
    positive: boolean | null;

    /** Wildcard positiveness and presence. */
    wildcard: boolean | null;

    /** Arguments of the node. Ignored if positive unset. */
    arguments?: object[];
}


/**
 * Data of a static permission node.
 */
export interface StaticPermission extends PermissionNode {
    /** Child permissions */
    permissions: StaticPermission[];

    /** Required parameters */
    requiredParams: string[];

    /** Optional parameters */
    optionalParams: string[];
}