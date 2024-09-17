import { IsNotEmpty, IsString } from "class-validator";
import { SchoolTypeEnum } from "../../enums/schoolType.enum";
export class Sprint2DTO {
  club: string
  @IsNotEmpty({message: "يجب تسجيل ألمؤهل"})
  @IsString({message: "يجب تسجيل ألمؤهل بشكل صحيح"})
  qualification: string
  school: string
  schoolType: SchoolTypeEnum
  college: string
  university: string
  specialization: string
  @IsNotEmpty({message: "يجب تسجيل الديانة"})
  @IsString({message: "يجب تسجيل الديانة بشكل صحيح"})
  religion: string
}