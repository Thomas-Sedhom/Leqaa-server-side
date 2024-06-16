import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as Joi from '@hapi/joi';
@Schema()
export class Contact {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  message: string;
}
export const ContactSchema = SchemaFactory.createForClass(Contact);
export const ContactJoiSchema: Joi.ObjectSchema<Contact> = Joi.object({
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  message: Joi.string().required(),
});
