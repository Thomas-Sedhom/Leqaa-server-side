import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Banner {
  @Prop({ required: true, type: String, trim: true })
  title: string
  @Prop({ required: true, type: String, trim: true })
  image: string
  @Prop({required: true, default: () => {
      new Date(Date.now()).toISOString()
    }})
  creationDate: string
}
export const BannerSchema = SchemaFactory.createForClass(Banner);
