import { IsNotEmpty } from "class-validator";
import { SkinColorEnum } from "../../enums/skinColor.enum";

export class Sprint3DTO{
  @IsNotEmpty({message: "يجب تسجيل لون البشرة"})
  skinColor: SkinColorEnum
  @IsNotEmpty({message: "يجب تسجيل الطول"})
  height: string
  @IsNotEmpty({message: "يجب تسجيل الوزن"})
  weight: string
  nameOfTheApplicantGuardian: string
  relationWithApplicant: string
  phoneOfGuardian: string
  hobbies: string
  habbits: string
  otherInfo: string
}