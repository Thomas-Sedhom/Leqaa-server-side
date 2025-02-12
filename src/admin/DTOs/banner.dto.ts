import { IsNotEmpty, IsString } from "class-validator";

export class BannerDto {
  @IsString({message: "Banner title should be string"})
  @IsNotEmpty({message: "Banner title is required"})
  title: string;
  image: string
}