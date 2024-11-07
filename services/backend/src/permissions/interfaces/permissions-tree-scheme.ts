/**
 * 
 */
export interface PermissionsTreeScheme {
    /** Path on a permissions tree of a current scheme object. */
    _path: string;

    /** Index signatures. */
    [key: string]: PermissionsTreeScheme | string;
}