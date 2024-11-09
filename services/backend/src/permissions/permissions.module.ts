import { DynamicModule, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsModuleOptions } from './interfaces/module-options.interface';
import { GroupsStorage } from './storages/groups.storage';
import { StaticPermissionsStorage } from './storages/static-permissions.storage';
import { Logger } from '@nestjs/common';
import permissionsUtil from './utils/permissions.util';
import nodeVariantsCallbacks from './utils/node-variants-callbacks.util';


@Module({})
export class PermissionsModule {
    private static logger: Logger = new Logger(PermissionsModule.name);

    private static displayStorages() {
        if(StaticPermissionsStorage.countPermissions() > 0) {
            this.logger.debug(`Registered ${StaticPermissionsStorage.countPermissions()}x base permissions. Displaying:`);
        } else {
            this.logger.debug(`No permissions have been registered.`);
        }

        for(let permission of StaticPermissionsStorage.getPermissions()) {
            permission = structuredClone(permission);
            permissionsUtil.sortPermission(permission);

            let paths = permissionsUtil.formAvailablePaths(nodeVariantsCallbacks.forStatic, permission);
            for(let path of paths) this.logger.debug(path);
        }


        this.logger.debug(' ');
        if(GroupsStorage.countGroups() > 0) {
            this.logger.debug(`Registered ${GroupsStorage.countGroups()}x groups. Displaying:`);
        } else {
            this.logger.debug(`No groups have been registered.`);
        }

        for(let group of GroupsStorage.getGroups()) {
            this.logger.debug(`Group: ${group.name}`);

            let parents = GroupsStorage.getParentGroups(group).map((group) => group.name).join(', ');
            if(parents.length > 0) this.logger.debug(`Extends: ${parents}`);

            this.logger.debug('Permissions:');
            for(let permission of group.permissions) {
                permission = structuredClone(permission);
                permissionsUtil.sortPermission(permission);

                let paths = permissionsUtil.formAvailablePaths(nodeVariantsCallbacks.forGroup, permission);
                for(let path of paths) this.logger.debug(path);
            }
            this.logger.debug(' ');
        }
    }

    static forRoot(options: PermissionsModuleOptions): DynamicModule {
        if(options.permissions) StaticPermissionsStorage.addPermissions(options.permissions);
        if(options.groups) GroupsStorage.addGroups(options.groups);

        this.displayStorages();

        return {
            module: PermissionsModule,
            providers: [PermissionsService],
            exports: [PermissionsService],
            global: options.global,
        };
    }
}