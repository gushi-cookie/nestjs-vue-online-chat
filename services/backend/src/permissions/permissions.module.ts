import { DynamicModule, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsModuleOptions } from './interfaces/module-options.interface';
import { GroupsStorage } from './storages/groups.storage';
import { StaticPermissionsStorage } from './storages/static-permissions.storage';


@Module({})
export class PermissionsModule {
    static forRoot(options: PermissionsModuleOptions): DynamicModule {
        if(options.permissions) StaticPermissionsStorage.addPermissions(options.permissions);
        if(options.groups) GroupsStorage.addGroups(options.groups);

        return {
            module: PermissionsModule,
            providers: [PermissionsService],
            exports: [PermissionsService],
            global: options.global,
        };
    }
}