
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { GenderEnum } from "../../enums/gender.enum";
import { SchoolTypeEnum } from "../../enums/schoolType.enum";
import { SkinColorEnum } from "../../enums/skinColor.enum";
class LanguageDto {
  @IsString()
  language: string;

  @IsString()
  level: string;
}
export class UserDto {
  email: string;
  firstName: string
  midName: string
  lastName:string
  age:number
  gender: GenderEnum
  DOB: Date
  nationality: string
  governorate: string
  city: string
  region: string
  address: string
  phone: string
  club: string
  qualification: string
  school: string
  schoolType: SchoolTypeEnum
  college: string
  university: string
  specialization: string
  languages: [LanguageDto];
  religion: string
  height: string
  weight: string
  skinColor: SkinColorEnum
  permanentDiseases: string
  permanentDiseasesDetails: string
  disability:  string
  disabilityDetails: string
  faceImage: string
  fullImage1: string
  fullImage2: string
  fullImage3: string
  fullImage4: string
  fullImage5: string
  idImage: string
  // manWithIdImage:string
  car: string
  carModel: string
  carType: string
  apartment: string
  space: number
  site: string
  businessOwner: string
  businessType: string
  job: string
  jobTitle: string
  jobCompany: string
  marriedBefore: string
  marriedNow: string
  children: string
  numberOfChildren: number
  agesOfChildren: string
  nameOfTheApplicantGuardian: string
  relationWithApplicant: string
  phoneOfGuardian: string
  hobbies: string
  habbits: string
  otherInfo: string
  livingAbroad:string
  isCompleted: boolean;
}