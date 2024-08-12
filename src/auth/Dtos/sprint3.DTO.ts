import { IsNotEmpty } from "class-validator";
import { SkinColorEnum } from "../../enums/skinColor.enum";

export class Sprint3DTO{
  @IsNotEmpty()
  skinColor: SkinColorEnum
  @IsNotEmpty()
  height: string
  @IsNotEmpty()
  weight: string
  nameOfTheApplicantGuardian: string
  relationWithApplicant: string
  phoneOfGuardian: string
  hobbies: string
  habbits: string
  otherInfo: string
}