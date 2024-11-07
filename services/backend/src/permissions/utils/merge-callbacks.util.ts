import { GroupPermission, StaticPermission, UserPermission } from '../interfaces/permission-nodes.interface';
import { MergeNodesCallback } from './permissions.util';


const forGroups: MergeNodesCallback<GroupPermission> = function(first, second) {
    return { key: '', permissions: [] };
};


const forStatics: MergeNodesCallback<StaticPermission> = function(first, second) {
    return {
        key: '', permissions: [],
        requiredParams: second.requiredParams,
        optionalParams: second.optionalParams,
    };
};


const forUsers: MergeNodesCallback<UserPermission> = function(first, second) {
    throw new Error(`TO-DO - implement merge function.`);
    // return {
    //     key: '', permissions: [],
    //     positive: second.positive,
    //     wildcard: second.wildcard,
    //     arguments: second.arguments,
    // };
};


export default {
    forGroups,
    forStatics,
    forUsers,
};