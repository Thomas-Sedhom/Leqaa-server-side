import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as Joi from '@hapi/joi';
import mongoose from "mongoose";
@Schema()
export class RejectedConnection {
  @Prop({ required: true, ref: 'User' })
  sender: mongoose.Types.ObjectId
  @Prop({ required: true, ref: 'User'  })
  receiver: mongoose.Types.ObjectId
  @Prop({required: true})
  requestDate: string
  @Prop({required: true})
  rejectDate: string
}
export const RejectedConnectionSchema = SchemaFactory.createForClass(RejectedConnection);

RejectedConnectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });
RejectedConnectionSchema.index({ sender: 1 });
RejectedConnectionSchema.index({ receiver: 1 });