import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as Joi from '@hapi/joi';
import { RoleEnum } from "../enums/role.enum";
@Schema()
export class Admin {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  role: RoleEnum;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
export const AdminJoiSchema: Joi.ObjectSchema<Admin> = Joi.object({
  name: Joi.string().required().messages({"message": "name is required" }),
  email: Joi.string().required().email().messages({ "message": "email is required" }),
  password: Joi.string().required()
    .pattern(/^.{8,}$/)
    .messages({
      'string.pattern.base': 'يجب ان يحتوي الرقم السري علي حرف كبير و رقم و لا يقل عن 8 احرف',
    }),
  role: Joi.string().required().messages({ "message": "role is required" }),
});