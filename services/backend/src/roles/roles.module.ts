import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './role.model';
import { RolesService } from './roles.service';


@Module({
    imports: [SequelizeModule.forFeature([Role])],
    providers: [RolesService],
    exports: [RolesService],
})
export class RolesModule {}