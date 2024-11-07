import { UserPermission } from './permission-nodes.interface';


/**
 * Describes permission abilities of a user.
 */
export interface UserAbilities {
    /** User group names. */
    groups: string[],

    /** User permissions. */
    permissions: UserPermission[];
}