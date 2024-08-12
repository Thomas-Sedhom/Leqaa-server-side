import { IsNotEmpty } from "class-validator";
export class WarningEmailDTO{
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  email: string;
}