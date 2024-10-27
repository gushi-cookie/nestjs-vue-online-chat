import { Module } from '@nestjs/common';
import { UserProfilesController } from './user-profiles.controller';
import { UserProfilesService } from './user-profiles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfile } from './user-profile.model';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { authProviders } from 'src/auth/auth.providers';
import { GridFSMapperModule } from 'src/gridfs-mapper/gridfs-mapper.module';
import { BucketType } from './constants';


@Module({
    imports: [
        GridFSMapperModule.forFeature([BucketType.ProfilePictures]),
        SequelizeModule.forFeature([UserProfile]),
        UsersModule,
        JwtModule,
    ],
    providers: [UserProfilesService, ...authProviders],
    controllers: [UserProfilesController],
    exports: [UserProfilesService],
})
export class UserProfilesModule {}