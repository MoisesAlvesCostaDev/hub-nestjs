import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Category extends Document {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'Product' }],
  })
  products: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
