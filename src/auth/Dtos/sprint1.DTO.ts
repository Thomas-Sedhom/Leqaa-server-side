import { IsNotEmpty, IsString } from "class-validator";
import { GenderEnum } from "../../enums/gender.enum";

export class Sprint1DTO {
  @IsNotEmpty()
  @IsString()
  firstName: string
  @IsString()
  @IsNotEmpty()
  midName: string
  @IsString()
  @IsNotEmpty()
  lastName:string
  @IsNotEmpty()
  age:number
  @IsNotEmpty()
  gender: GenderEnum
  @IsNotEmpty()
  DOB: Date
  @IsNotEmpty()
  @IsString()
  nationality: string
  @IsNotEmpty()
  @IsString()
  governorate: string
  @IsNotEmpty()
  @IsString()
  city: string
  @IsNotEmpty()
  @IsString()
  region: string
  @IsNotEmpty()
  @IsString()
  address: string
  @IsNotEmpty()
  @IsString()
  phone: string
}