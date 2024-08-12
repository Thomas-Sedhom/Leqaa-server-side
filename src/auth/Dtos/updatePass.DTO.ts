import { IsNotEmpty } from "class-validator";

export class UpdatePassDto {
  @IsNotEmpty()
  email: string
  @IsNotEmpty()
  password: string
}