import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from "mongoose";
@Schema()
export class RemovedPendingConnection {
  @Prop({ required: true, ref: 'User' })
  sender: mongoose.Types.ObjectId
  @Prop({ required: true, ref: 'User'  })
  receiver: mongoose.Types.ObjectId
  @Prop({required: true, default: () => new Date().toISOString()})
  removedDate: string
}
export const RemovedPendingConnectionSchema = SchemaFactory.createForClass(RemovedPendingConnection);

RemovedPendingConnectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });
RemovedPendingConnectionSchema.index({ sender: 1 });
RemovedPendingConnectionSchema.index({ receiver: 1 });
