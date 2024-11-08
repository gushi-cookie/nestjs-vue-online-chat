import { Group } from './group.interface';
import { StaticPermission } from './permission-nodes.interface';


/**
 * Initialization options for the Permissions Module.
 */
export interface PermissionsModuleOptions {
    /**
     * List of permissions to store. Keys can
     * duplicate since all permissions get merged.
     */
    permissions?: StaticPermission[];

    /**
     * List of groups to store. Names can
     * duplicate since all groups get merged.
     */
    groups?: Group[];

    /**
     * Register this module as global.
     */
    global?: boolean;
}