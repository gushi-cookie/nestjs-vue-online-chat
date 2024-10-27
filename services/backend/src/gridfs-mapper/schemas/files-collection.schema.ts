import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';


@Schema()
export class FilesCollection {
    @Prop()
    _id: Types.ObjectId;

    @Prop()
    length: number;

    @Prop()
    chunkSize: number;

    @Prop()
    uploadDate: string;

    @Prop()
    filename: string;
}

export const filesCollectionSchema = SchemaFactory.createForClass(FilesCollection);