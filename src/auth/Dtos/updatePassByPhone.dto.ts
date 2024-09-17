import { IsNotEmpty } from "class-validator";

export class UpdatePassByPhoneDto {
  @IsNotEmpty()
  phone: string
  @IsNotEmpty()
  password: string
}