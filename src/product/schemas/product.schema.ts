import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Product extends Document {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop()
  imageUrl: string;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'Category' }],
  })
  categories: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
