import { Inject, Injectable } from '@nestjs/common';
import { InjectModel as InjectSequelizeModel } from '@nestjs/sequelize';
import { UserProfile } from './user-profile.model';
import { User } from 'src/users/user.model';
import { GridFSMapperBucket } from 'src/gridfs-mapper/gridfs-mapper.bucket';
import { Readable } from 'node:stream';
import { BucketType } from './constants';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import UserCreatedEvent from 'src/auth/events/user-created.event';
import UserProfileCreatedEvent from './events/user-profile-created.event';


@Injectable()
export class UserProfilesService {
    constructor(
        @InjectSequelizeModel(UserProfile)
        private readonly profileModel: typeof UserProfile,

        @Inject(BucketType.ProfilePictures)
        private readonly bucket: GridFSMapperBucket,

        private readonly eventEmitter: EventEmitter2,
    ) {}


    @OnEvent(UserCreatedEvent.eventName)
    async onUserCreated(event: UserCreatedEvent) {
        let pictureId: string | null = null;
        if(event.profilePicture) {
            pictureId = await this.bucket.uploadFile(event.profilePicture.buffer, event.profilePicture.filename);
        }
        
        let profile = await this.createProfile(event.userId, pictureId);
        this.eventEmitter.emit(UserProfileCreatedEvent.eventName, new UserProfileCreatedEvent(event.userId, profile.id));
    }


    async findProfile(userId: number, includeUser: boolean): Promise<UserProfile | null> {
        return await this.profileModel.findOne({
            where: { userId },
            include: includeUser ? [User] : undefined,
        });
    }

    async uploadPfp(file: Express.Multer.File): Promise<string> {
        return await this.bucket.uploadFile(file.buffer, file.originalname);
    }

    async downloadPfp(id: string, fileName: string): Promise<Readable | null> {
        return await this.bucket.downloadFile(id, fileName);
    }

    async createProfile(userId: number, profilePictureId: string | null): Promise<UserProfile> {
        return await this.profileModel.create({
            userId,
            profilePictureId,
        });
    }
}