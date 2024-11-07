import { GroupPermission } from './permission-nodes.interface';


/**
 * Represents a named group of permissions and child groups by name.
 */
export interface Group {
    /** Group name. */
    name: string;

    /** Group permissions. */
    permissions: GroupPermission[];

    /** Names of child groups. */
    childGroups: string[];
}