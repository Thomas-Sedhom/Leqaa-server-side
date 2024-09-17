import { IsNotEmpty, IsString } from "class-validator";
import { GenderEnum } from "../../enums/gender.enum";

export class Sprint1DTO {
  @IsNotEmpty({message: "يجب تسجيل الاسم الاول"})
  @IsString({message: "يجب تسجيل الاسم الاول بشكل صحيح"})
  firstName: string
  @IsNotEmpty({message: "يجب تسجيل الاسم الاوسط"})
  @IsString({message: "يجب تسجيل الاسم الاوسط بشكل صحيح"})
  midName: string
  @IsNotEmpty({message: "يجب تسجيل الاسم الاخير"})
  @IsString({message: "يجب تسجيل الاسم الاخير بشكل صحيح"})
  lastName:string
  @IsNotEmpty({message: "يجب تسجيل العمر"})
  age:number
  @IsNotEmpty({message: "يجب تسجيل نوع الجنس"})
  gender: GenderEnum
  @IsNotEmpty({message: "يجب تسجيل تاريخ الميلاد"})
  DOB: Date
  @IsNotEmpty({message: "يجب تسجيل الدولة"})
  @IsString({message: "يجب تسجيل الدولة بشكل صحيح"})
  nationality: string
  @IsNotEmpty({message: "يجب تسجيل المحافظة"})
  @IsString({message: "يجب تسجيل المحافظة بشكل صحيح"})
  governorate: string
  @IsNotEmpty({message: "يجب تسجيل المدنية"})
  @IsString({message: "يجب تسجيل المدنية بشكل صحيح"})
  city: string
  @IsNotEmpty({message: "يجب تسجيل المنطقة"})
  @IsString({message: "يجب تسجيل المنطقة بشكل صحيح"})
  region: string
  @IsNotEmpty({message: "يجب تسجيل العنوان"})
  @IsString({message: "يجب تسجيل العنوان بشكل صحيح"})
  address: string
  @IsNotEmpty({message: "يجب تسجيل رقم الهاتف"})
  @IsString({message: "يجب تسجيل رقم الهاتف بشكل صحيح"})
  phone: string
}