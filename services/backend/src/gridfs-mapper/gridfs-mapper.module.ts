import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { gridFSMapperSchema } from './schemas/gridfs-mapper.schema';
import { createGridFSProviders } from './gridfs-mapper.providers';
import { filesCollectionSchema } from './schemas/files-collection.schema';


@Module({})
export class GridFSMapperModule {
    static forFeature(bucketNames: string[]): DynamicModule {
        const providers = createGridFSProviders(bucketNames);

        const mongooseModules: DynamicModule[] = [];
        for(let bucket of bucketNames) {
            mongooseModules.push(MongooseModule.forFeature([
                {
                    name: `${bucket}_map`,
                    schema: gridFSMapperSchema,
                },
                {
                    name: `${bucket}.files`,
                    schema: filesCollectionSchema,
                },
            ]));
        }

        return {
            module: GridFSMapperModule,
            imports: [...mongooseModules],
            providers: providers,
            exports: providers,
        }
    }
}