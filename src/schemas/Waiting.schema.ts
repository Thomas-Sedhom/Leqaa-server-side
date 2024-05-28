import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { GenderEnum } from '../enums/gender.enum';
import { SchoolTypeEnum } from '../enums/schoolType.enum';
import { SkinColorEnum } from '../enums/skinColor.enum';
import * as Joi from '@hapi/joi';
@Schema()
export class Waiting {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  midName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true })
  gender: GenderEnum;
  @Prop({ required: true })
  DOB: Date;
  @Prop({ required: true })
  nationality: string;
  @Prop({ required: true })
  governorate: string;
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  region: string;
  @Prop({ required: true })
  address: string;
  @Prop({ required: true })
  phone: number;
  @Prop({ required: false })
  club: string;
  @Prop({ required: true })
  qualification: string;
  @Prop({ required: false })
  school: string;
  @Prop({ required: false })
  schoolType: SchoolTypeEnum;
  @Prop({ required: false })
  college: string;
  @Prop({ required: false })
  university: string;
  @Prop({ required: false })
  specialization: string;
  @Prop({ required: true })
  languages: [
    {
      language: string;
      level: string;
    },
  ];
  @Prop({ required: true })
  religion: string;
  @Prop({ required: true })
  height: number;
  @Prop({ required: true })
  weight: number;
  @Prop({ required: true })
  skinColor: SkinColorEnum;
  @Prop({ required: true })
  permanentDiseases: boolean;
  @Prop({ required: false })
  permanentDiseasesDetails: string;
  @Prop({ required: true })
  disability: boolean;
  @Prop({ required: false })
  disabilityDetails: string;
  @Prop({ required: true })
  images: {
    face: string;
    full: string;
    nationalID: string;
    applicantWithNationalID: string;
  };
  @Prop({ required: true })
  car: boolean;
  @Prop({ required: false })
  carModel: string;
  @Prop({ required: false })
  carType: string;
  @Prop({ required: true })
  apartment: boolean;
  @Prop({ required: false })
  space: number;
  @Prop({ required: false })
  site: string;
  @Prop({ required: true })
  businessOwner: boolean;
  @Prop({ required: false })
  businessType: string;
  @Prop({ required: true })
  job: boolean;
  @Prop({ required: false })
  jobTitle: string;
  @Prop({ required: false })
  jobCompany: string;
  @Prop({ required: true })
  marriedBefore: boolean;
  @Prop({ required: true })
  marriedNow: boolean;
  @Prop({ required: true })
  children: boolean;
  @Prop({ required: false })
  numberOfChildren: number;
  @Prop({ required: false })
  agesOfChildren: string;
  @Prop({ required: false })
  nameOfTheApplicantGuardian: string;
  @Prop({ required: false })
  relationWithApplicant: string;
  @Prop({ required: false })
  phoneOfGuardian: number;
  @Prop({ required: true })
  hobbies: [string];
  @Prop({ required: true })
  habits: [string];
  @Prop({ required: false })
  otherInfo: string;
  @Prop({ required: true })
  livingAbroad: boolean;
}
export const WaitingSchema = SchemaFactory.createForClass(Waiting);

const strongPassword:RegExp =  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$_#!%*?&]{8,}$/;
const phoneNumber:RegExp = /^0(10|11|12|15)\d{8}$/
export const WaitingJoiSchema: Joi.ObjectSchema<Waiting> = Joi.object({
  email: Joi.string().email().required().message("Enter valid email"),
  password: Joi
    .string()
    .required()
    .pattern(strongPassword)
    .message({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8 characters long',
    }),
  firstName: Joi.string().required().message("Please provide a valid firstName"),
  midName: Joi.string().required().message("Please provide a valid midName"),
  lastName: Joi.string().required().message("Please provide a valid lastName" ),
  gender: Joi.valid(...Object.values(GenderEnum)).required().message("Please provide a valid gender"),
  DOB: Joi.date().required().message("Please provide a valid birth date"),
  nationality: Joi.string().required().message("Please provide a valid nationality"),
  governorate: Joi.string().required().message("Please provide a valid governorate"),
  city: Joi.string().required().message("Please provide a valid city" ),
  region: Joi.string().required().message("Please provide a valid region"),
  address: Joi.string().required().message("Please provide a valid address"),
  phone: Joi.number().required().valid(phoneNumber).message("Please provide a valid number phone"),
  club: Joi.string().message("Please provide a valid club"),
  qualification: Joi.string().required().message("Please provide a valid qualification"),
  school: Joi.string().message("Please provide a valid school"),
  schoolType: Joi.string().message("Please provide a valid schoolType"),
  college: Joi.string().message("Please provide a valid college"),
  university: Joi.string().message("Please provide a valid university"),
  specialization: Joi.string().message("Please provide a valid specialization"),
  languages: Joi.array().item(
    Joi.object({
      language: Joi.string().required().message("Please provide a valid language."),
      level: Joi.string().required().message("Please specify your proficiency level."),
    })
  ).required().message("You must provide information about your spoken languages."),
  religion: Joi.string().required().message("Please provide a valid religion."),
  height: Joi.number().required().min(1.2).max(3).message("Please provide a valid height."),
  weight: Joi.number().required().min(20).max(500).message("Please provide a valid weight."),
  skinColor: Joi.required().valid(...Object.values(SkinColorEnum)).message("Please provide a valid skinColor."),
  permanentDiseases: Joi.boolean().required().message("Please provide an answer if you have a permanentDiseases or not."),
  permanentDiseasesDetails: Joi.string().message("Please provide a valid permanentDiseases."),
  disability: Joi.boolean().required().message("Please provide an answer if you have a disability or not."),
  disabilityDetails: Joi.string().message("Please provide a valid disabilityDetails."),
  images: Joi.array().items(
    Joi.object({
      face: Joi.string().required().message("Please provide a valid face image."),
      full: Joi.string().required().message("Please provide a valid full image."),
      nationalID: Joi.string().required().message("Please provide a valid national ID image."),
      applicantWithNationalID: Joi.string().required().message("Please provide a valid applicantWithNationalID image."),
    })
  ),
  car: Joi.boolean().required().message("Please provide an answer if you have a car or not."),
  carModel: Joi.string().message("Please provide a valid carModel."),
  carType: Joi.string().message("Please provide a valid carType."),
  apartment: Joi.boolean().required().message("Please provide an answer if you have an apartment or not."),
  space: Joi.number().min(40).message("Please provide a valid apartment space."),
  site: Joi.string().message("Please provide a valid apartment site."),
  businessOwner: Joi.boolean().required().message("Please provide an answer if you business owner or not."),
  businessType: Joi.string().message("Please provide a valid business type."),
  job: Joi.boolean().required().message("Please provide an answer if you have a job or not."),
  jobTitle: Joi.string().message("Please provide a valid job title."),
  jobCompany: Joi.string().message("Please provide a valid job company."),
  marriedBefore: Joi.boolean().required().message("Please provide an answer if you married before or not."),
  marriedNow: Joi.boolean().required().message("Please provide an answer if you married now or not."),
  children: Joi.boolean().required().message("Please provide an answer if you have children or not."),
  numberOfChildren: Joi.number().message("Please provide a valid number of children."),
  agesOfChildren: Joi.string().message("Please provide a valid ages of children."),
  nameOfTheApplicantGuardian: Joi.string().message("Please provide a valid name of the applicant guardian."),
  relationWithApplicant: Joi.string().message("Please provide a valid name of the applicant guardian."),
  phoneOfGuardian: Joi.number().pattern(phoneNumber).message("Please provide a valid phone number of the applicant guardian."),
  hobbies: Joi.array().items(Joi.string()).required(),
  habits: Joi.array().items(Joi.string()).required(),
  otherInfo: Joi.string().message('Please provide a valid other information.'),
  livingAbroad: Joi.boolean()
    .required()
    .message('Please provide an answer if you livingAbroad or not.'),
});
