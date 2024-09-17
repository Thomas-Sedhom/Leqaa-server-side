import { IsEmail, IsNotEmpty, Matches } from "class-validator";
export class SignupDto{
  @IsNotEmpty()
  email: string;
  @IsNotEmpty({message: 'يجب ملئ رقم الهاتف'})
  phone: string;
  @IsNotEmpty()
  @Matches(/.{8,}/, { message: 'يجب ان يحتوي الرقم السري علي حرف كبير و رقم و لا يقل عن 8 احرف' })
  password: string;
}