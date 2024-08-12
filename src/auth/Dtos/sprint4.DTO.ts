import { IsNotEmpty, IsOptional, IsString } from "class-validator";
class LanguageDto {
  @IsString()
  language: string;

  @IsString()
  level: string;
}
export class Sprint4DTO{
  @IsNotEmpty()
  permanentDiseases: string
  permanentDiseasesDetails: string
  @IsNotEmpty()
  disability:  string
  disabilityDetails: string
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
  @IsNotEmpty()
  livingAbroad:string
  languages: [LanguageDto];
  @IsOptional()
  faceImage: string
  @IsOptional()
  fullImage1: string
  @IsOptional()
  fullImage2: string
  @IsOptional()
  fullImage3: string
  @IsOptional()
  fullImage4: string
  @IsOptional()
  fullImage5: string
  @IsOptional()
  idImage: string
  // manWithIdImage:string
}