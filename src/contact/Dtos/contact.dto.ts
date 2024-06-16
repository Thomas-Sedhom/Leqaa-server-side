import { IsNotEmpty, IsString } from "class-validator";
export class ContactDto{
  userId?: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  message: string;
}