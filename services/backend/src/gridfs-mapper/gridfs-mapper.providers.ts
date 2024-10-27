import { Provider } from '@nestjs/common';
import { GridFSMapperBucket, initImports } from './gridfs-mapper.bucket';
import { Connection, Model } from 'mongoose';
import { GridFSMapper } from './schemas/gridfs-mapper.schema';
import { FilesCollection } from './schemas/files-collection.schema';


export function createGridFSProviders(bucketNames: string[]): Provider[] {
    let providers: Provider[] = [];

    for(let bucket of bucketNames) {
        providers.push({
            provide: bucket,
            useFactory: async (
                connection: Connection,
                mapperModel: Model<GridFSMapper>,
                filesModel: Model<FilesCollection>
            ) => {
                await initImports();
                return new GridFSMapperBucket(connection, mapperModel, filesModel, bucket);
            },
            inject: ['DatabaseConnection', `${bucket}_mapModel`, `${bucket}.filesModel`]
        });
    }

    return providers;
}