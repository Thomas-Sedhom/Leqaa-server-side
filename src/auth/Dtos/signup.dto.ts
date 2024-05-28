import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class SignupDto{
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$_#!%*?&]{8,}$/, { message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8 characters long' })
  password: string;
}