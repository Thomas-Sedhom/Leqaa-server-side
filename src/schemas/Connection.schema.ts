import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as Joi from '@hapi/joi';
import mongoose from "mongoose";
@Schema()
export class Connection {
  @Prop({ required: true, ref: 'User' })
  userId1: mongoose.Types.ObjectId
  @Prop({ required: true, ref: 'User'  })
  userId2:mongoose.Types.ObjectId
}
export const ConnectionSchema = SchemaFactory.createForClass(Connection);

ConnectionSchema.index({ userId1: 1, userId2: 1 }, { unique: true });
ConnectionSchema.index({ userId1: 1 });
ConnectionSchema.index({ userId2: 1 });
export const ConnectionJoiSchema: Joi.ObjectSchema<Connection> = Joi.object({
  userId1: Joi.string().required(),
  userId2: Joi.string().required(),
});
