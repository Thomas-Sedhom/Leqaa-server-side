import { IsNotEmpty, IsString } from "class-validator";
import { SchoolTypeEnum } from "../../enums/schoolType.enum";
export class Sprint2DTO {
  club: string
  @IsNotEmpty()
  @IsString()
  qualification: string
  school: string
  schoolType: SchoolTypeEnum
  college: string
  university: string
  specialization: string
  @IsNotEmpty()
  @IsString()
  religion: string
}