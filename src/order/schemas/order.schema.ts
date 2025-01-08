import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Order extends Document {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Date, default: () => new Date() })
  date: Date;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'Product' }],
  })
  products: Types.ObjectId[];

  @Prop({ required: true, type: Number })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
