import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as Joi from '@hapi/joi';
import mongoose from "mongoose";
@Schema()
export class PendingConnection {
  @Prop({ required: true, ref: 'User' })
  sender: mongoose.Types.ObjectId
  @Prop({ required: true, ref: 'User'  })
  receiver: mongoose.Types.ObjectId
  @Prop({required: true})
  requestDate: string
}
export const PendingConnectionSchema = SchemaFactory.createForClass(PendingConnection);

PendingConnectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });
PendingConnectionSchema.index({ sender: 1 });
PendingConnectionSchema.index({ receiver: 1 });

export const PendingConnectionJoiSchema: Joi.ObjectSchema<PendingConnection> = Joi.object({
  userId1: Joi.string().required(),
  userId2: Joi.string().required(),
});
