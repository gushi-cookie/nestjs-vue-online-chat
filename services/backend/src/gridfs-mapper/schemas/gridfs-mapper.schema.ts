import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class GridFSMapper {
    @Prop()
    originId: string;

    @Prop({ unique: true, type: [String], index: true })
    mappedId: string;
}

export const gridFSMapperSchema = SchemaFactory.createForClass(GridFSMapper);