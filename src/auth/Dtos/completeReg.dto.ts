import { GenderEnum } from "../../enums/gender.enum";
import { SkinColorEnum } from "../../enums/skinColor.enum";
import { SchoolTypeEnum } from "../../enums/schoolType.enum";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
class LanguageDto {
  @IsString()
  language: string;

  @IsString()
  level: string;
}
export class CompleteRegDto{
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
  club: string
  @IsNotEmpty()
  @IsString()
  qualification: string
  school: string
  schoolType: SchoolTypeEnum
  college: string
  university: string
  specialization: string
  languages: [LanguageDto];
  @IsNotEmpty()
  @IsString()
  religion: string
  @IsNotEmpty()
  height: string
  @IsNotEmpty()
  weight: string
  @IsNotEmpty()
  skinColor: SkinColorEnum
  @IsNotEmpty()
  // @IsBoolean()
  permanentDiseases: string
  permanentDiseasesDetails: string
  @IsNotEmpty()
  disability:  string
  disabilityDetails: string
  faceImage: string
  fullImage: string
  idImage: string
  // manWithIdImage:string
  // @IsNotEmpty()
  @IsNotEmpty()
  car: string
  carModel: string
  carType: string
  @IsNotEmpty()
  apartment: string
  space: number
  site: string
  @IsNotEmpty()
  businessOwner: string
  businessType: string
  @IsNotEmpty()
  job: string
  jobTitle: string
  jobCompany: string
  @IsNotEmpty()
  marriedBefore: string
  @IsNotEmpty()
  marriedNow: string
  @IsNotEmpty()
  children: string
  numberOfChildren: number
  agesOfChildren: string
  nameOfTheApplicantGuardian: string
  relationWithApplicant: string
  phoneOfGuardian: string
  hobbies: string
  habbits: string
  otherInfo: string
  @IsNotEmpty()
  livingAbroad:string
  isCompleted: boolean;
}