import mongoose, { Connection, Model } from 'mongoose';
import { GridFSMapper } from './schemas/gridfs-mapper.schema';
import { Readable } from 'node:stream';
import { importNanoid, nanoidType } from 'src/common/esm-modules';
import { FilesCollection } from './schemas/files-collection.schema';
let nanoid: nanoidType['nanoid'];


export async function initImports() {
    if(!nanoid) nanoid = (await importNanoid()).nanoid;
}


export class GridFSMapperBucket {
    private bucket: mongoose.mongo.GridFSBucket;

    constructor(
        private mongooseConnection: Connection,
        private mapperModel: Model<GridFSMapper>,
        private filesModel: Model<FilesCollection>,
        private bucketName: string,
    ) {
        this.initBucket();
    }

    private initBucket() {
        const db = this.mongooseConnection.db;
        if(!db) throw new Error('Mongoose connection db is undefined.');

        this.bucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: this.bucketName,
            chunkSizeBytes: 1024000,
        });
    }


    private async generateUniqueMappedId(): Promise<string> {
        for(let i = 0; i < 10; i++) {
            let id = nanoid(64);
            if(await this.mapperModel.where({ mappedId: id }).countDocuments() <= 0) {
                return id;
            }
        }
        throw new Error(`Couldn't generate a unique mappedId.`);
    }

    async uploadFile(file: Buffer, fileName: string): Promise<string> {
        const bucketWriteStream = this.bucket.openUploadStream(fileName);
        const readableStream = Readable.from(file);
        readableStream.pipe(bucketWriteStream);

        await new Promise((resolve, reject) => {
            bucketWriteStream.on('error', () => reject(bucketWriteStream.errored));
            readableStream.on('error', () => reject(readableStream.errored));
            readableStream.on('end', () => resolve(null));
        });

        const objectId = bucketWriteStream.id.toString();
        const mappedId = await this.generateUniqueMappedId();

        await this.mapperModel.create({
            originId: objectId,
            mappedId: mappedId,
        });

        return `${mappedId}/${fileName}`;
    }

    async downloadFile(id: string, fileName: string): Promise<Readable | null> {
        let mapper = await this.mapperModel.findOne({ mappedId: id });
        if(!mapper) return null;
        
        let fileData = await this.filesModel.findById(new mongoose.Types.ObjectId(mapper.originId));
        if(!fileData) throw new Error(`File data by id ${mapper.originId} not found for the mapper with id '${mapper._id.toString()}'.`);
        if(fileData.filename !== fileName) return null;

        return this.bucket.openDownloadStream(new mongoose.Types.ObjectId(mapper.originId));
    }

    async deleteFile(id: string) {
        let mapper = await this.mapperModel.findOne({ mappedId: id });
        if(!mapper) return;

        await this.bucket.delete(new mongoose.Types.ObjectId(mapper.originId));
        await this.mapperModel.findByIdAndDelete(new mongoose.Types.ObjectId(mapper.mappedId));
    }
}