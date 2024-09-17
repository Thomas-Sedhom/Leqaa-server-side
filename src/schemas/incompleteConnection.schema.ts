import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as Joi from '@hapi/joi';
import mongoose from "mongoose";
@Schema()
export class IncompleteConnection {
  @Prop({ required: true, ref: 'User' })
  userId1: mongoose.Types.ObjectId
  @Prop({ required: true, ref: 'User'  })
  userId2: mongoose.Types.ObjectId
  @Prop({required: true, default: () => {
    new Date(Date.now()).toISOString()
    }})
  incompleteDate: string
}
export const IncompleteConnectionSchema = SchemaFactory.createForClass(IncompleteConnection);

IncompleteConnectionSchema.index({ userId1: 1, userId2: 1 }, { unique: true });
IncompleteConnectionSchema.index({ userId1: 1 });
IncompleteConnectionSchema.index({ userId2: 1 });

export const IncompleteConnectionJoiSchema: Joi.ObjectSchema<IncompleteConnection> = Joi.object({
  userId1: Joi.string().required(),
  userId2: Joi.string().required(),
});
