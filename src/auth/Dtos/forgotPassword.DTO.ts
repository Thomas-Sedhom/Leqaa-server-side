import { IsNotEmpty } from "class-validator";

export class ForgotPasswordDTO{
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  verificationCode: string;
}