import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { GenderEnum } from '../enums/gender.enum';
import { SchoolTypeEnum } from '../enums/schoolType.enum';
import { SkinColorEnum } from '../enums/skinColor.enum';
import * as Joi from '@hapi/joi';
@Schema()
export class User {
  @Prop({  unique: true })
  email: string;
  @Prop({  })
  password: string;
  @Prop({  default: false })
  isCompleted: boolean;
  @Prop({ default: false })
  isApprove: boolean;
  @Prop({ default: false })
  isHidden: boolean;
  @Prop({  default: null })
  firstName: string;
  @Prop({  default: null })
  midName: string;
  @Prop({  default: null })
  lastName: string;
  @Prop({  default: 0  })
  age: number;
  @Prop({  default: null  })
  gender: GenderEnum;
  @Prop({  default: null })
  DOB: Date;
  @Prop({  default: null })
  nationality: string;
  @Prop({  default: null })
  governorate: string;
  @Prop({  default: null })
  city: string;
  @Prop({  default: null })
  region: string;
  @Prop({  default: null })
  address: string;
  @Prop({  default: null })
  phone: string;
  @Prop({ required: false , default: null })
  club: string;
  @Prop({  default: null })
  qualification: string;
  @Prop({ required: false , default: null })
  school: string;
  @Prop({ required: false , default: null })
  schoolType: SchoolTypeEnum;
  @Prop({ required: false , default: null })
  college: string;
  @Prop({ required: false , default: null })
  university: string;
  @Prop({ required: false , default: null })
  specialization: string;
  @Prop({ required: true, default: null  })
  languages: [
    {
      language: string;
      level: string;
    },
  ];
  @Prop({ default: null  })
  religion: string;
  @Prop({  default: null })
  height: string;
  @Prop({  default: null })
  weight: string;
  @Prop({  default: null })
  skinColor: SkinColorEnum;
  @Prop({  default: null })
  permanentDiseases: boolean;
  @Prop({ required: false, default: null  })
  permanentDiseasesDetails: string;
  @Prop({  default: null })
  disability: boolean;
  @Prop({ required: false, default: null  })
  disabilityDetails: string;
  @Prop({ required: false , default: null })
  faceImage: string;
  @Prop({ required: false , default: null })
  fullImage1: string;
  @Prop({ required: false , default: null })
  fullImage2: string;
  @Prop({ required: false , default: null })
  fullImage3: string;
  @Prop({ required: false , default: null })
  fullImage4: string;
  @Prop({ required: false , default: null })
  fullImage5: string;
  @Prop({ required: false , default: null })
  idImage: string;
  @Prop({ required: false , default: null })
  manWithIdImage: string;
  @Prop({ default: null  })
  car: boolean;
  @Prop({ required: false, default: null  })
  carModel: string;
  @Prop({ required: false , default: null })
  carType: string;
  @Prop({  default: null })
  apartment: boolean;
  @Prop({ required: false, default: null  })
  space: number;
  @Prop({ required: false, default: null  })
  site: string;
  @Prop({  default: null })
  businessOwner: boolean;
  @Prop({ required: false, default: null  })
  businessType: string;
  @Prop({  default: null })
  job: boolean;
  @Prop({ required: false, default: null  })
  jobTitle: string;
  @Prop({ required: false, default: null  })
  jobCompany: string;
  @Prop({  default: null })
  marriedBefore: boolean;
  @Prop({  default: null })
  marriedNow: boolean;
  @Prop({  default: null })
  children: boolean;
  @Prop({ required: false , default: null })
  numberOfChildren: number;
  @Prop({ required: false, default: null  })
  agesOfChildren: string;
  @Prop({ required: false , default: null })
  nameOfTheApplicantGuardian: string;
  @Prop({ required: false , default: null })
  relationWithApplicant: string;
  @Prop({ required: false , default: null })
  phoneOfGuardian: string;
  @Prop({  default: null })
  hobbies: string;
  @Prop({  default: null  })
  habits: string;
  @Prop({ required: false , default: null })
  otherInfo: string;
  @Prop({  default: null  })
  livingAbroad: boolean;
  @Prop({  default: "user" })
  role: string;
  @Prop({default: ""})
  warning: string;
  @Prop()
  registrationDate: string;
  @Prop()
  latestWarningDate: string;
  @Prop({ default: false })
  block: boolean;
  @Prop({default: false})
  sprint1: boolean
  @Prop({default: false})
  sprint2: boolean
  @Prop({default: false})
  sprint3: boolean
  @Prop({default: false})
  sprint4: boolean
}
export const UserSchema = SchemaFactory.createForClass(User);

const strongPassword:RegExp =  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$_#!%*?&]{8,}$/;
const phoneNumber:RegExp = /^0(10|11|12|15)\d{8}$/
export const UserJoiSchema: Joi.ObjectSchema<User> = Joi.object({
  email: Joi.string().email().required().messages({ "messages":"Enter valid email"}),
  password: Joi
    .string()
    .required()
    .pattern(strongPassword)
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8 characters long',
    }),
  firstName: Joi.string().required().messages({ "messages":"Please provide a valid firstName"}),
  midName: Joi.string().required().messages({ "messages":"Please provide a valid midName"}),
  lastName: Joi.string().required().messages({ "messages":"Please provide a valid lastName"} ),
  gender: Joi.valid(...Object.values(GenderEnum)).required().messages({ "messages":"Please provide a valid gender"}),
  DOB: Joi.date().required().messages({ "messages":"Please provide a valid birth date"}),
  nationality: Joi.string().required().messages({ "messages":"Please provide a valid nationality"}),
  governorate: Joi.string().required().messages({ "messages":"Please provide a valid governorate"}),
  city: Joi.string().required().messages({ "messages":"Please provide a valid city"} ),
  region: Joi.string().required().messages({ "messages":"Please provide a valid region"}),
  address: Joi.string().required().messages({ "messages":"Please provide a valid address"}),
  phone: Joi.number().required().valid(phoneNumber).messages({ "messages":"Please provide a valid number phone"}),
  club: Joi.string().messages({ "messages":"Please provide a valid club"}),
  qualification: Joi.string().required().messages({ "messages":"Please provide a valid qualification"}),
  school: Joi.string().messages({ "messages":"Please provide a valid school"}),
  schoolType: Joi.string().messages({ "messages":"Please provide a valid schoolType"}),
  college: Joi.string().messages({ "messages":"Please provide a valid college"}),
  university: Joi.string().messages({ "messages":"Please provide a valid university"}),
  specialization: Joi.string().messages({ "messages":"Please provide a valid specialization"}),
  languages: Joi.array().required().messages({ "messages":"You must provide information about your spoken languages."}),
  religion: Joi.string().required().messages({ "messages":"Please provide a valid religion."}),
  height: Joi.number().required().min(1.2).max(3).messages({ "messages":"Please provide a valid height."}),
  weight: Joi.number().required().min(20).max(500).messages({ "messages":"Please provide a valid weight."}),
  skinColor: Joi.required().valid(...Object.values(SkinColorEnum)).messages({ "messages":"Please provide a valid skinColor."}),
  permanentDiseases: Joi.boolean().required().messages({ "messages":"Please provide an answer if you have a permanentDiseases or not."}),
  permanentDiseasesDetails: Joi.string().messages({ "messages":"Please provide a valid permanentDiseases."}),
  disability: Joi.boolean().required().messages({ "messages":"Please provide an answer if you have a disability or not."}),
  disabilityDetails: Joi.string().messages({ "messages":"Please provide a valid disabilityDetails."}),
  faceImage: Joi.string().required().messages({ "messages":"Please provide a valid face image."}),
  fullImage: Joi.string().required().messages({ "messages":"Please provide a valid full image."}),
  idImage: Joi.string().required().messages({ "messages":"Please provide a valid national ID image."}),
  manWithIdImage: Joi.string().required().messages({ "messages":"Please provide a valid applicantWithNationalID image."}),
  car: Joi.boolean().required().messages({ "messages":"Please provide an answer if you have a car or not."}),
  carModel: Joi.string().messages({ "messages":"Please provide a valid carModel."}),
  carType: Joi.string().messages({ "messages":"Please provide a valid carType."}),
  apartment: Joi.boolean().required().messages({ "messages":"Please provide an answer if you have an apartment or not."}),
  space: Joi.number().min(40).messages({ "messages":"Please provide a valid apartment space."}),
  site: Joi.string().messages({ "messages":"Please provide a valid apartment site."}),
  businessOwner: Joi.boolean().required().messages({ "messages":"Please provide an answer if you business owner or not."}),
  businessType: Joi.string().messages({ "messages":"Please provide a valid business type."}),
  job: Joi.boolean().required().messages({ "messages":"Please provide an answer if you have a job or not."}),
  jobTitle: Joi.string().messages({ "messages":"Please provide a valid job title."}),
  jobCompany: Joi.string().messages({ "messages":"Please provide a valid job company."}),
  marriedBefore: Joi.boolean().required().messages({ "messages":"Please provide an answer if you married before or not."}),
  marriedNow: Joi.boolean().required().messages({ "messages":"Please provide an answer if you married now or not."}),
  children: Joi.boolean().required().messages({ "messages":"Please provide an answer if you have children or not."}),
  numberOfChildren: Joi.number().messages({ "messages":"Please provide a valid number of children."}),
  agesOfChildren: Joi.string().messages({ "messages":"Please provide a valid ages of children."}),
  nameOfTheApplicantGuardian: Joi.string().messages({ "messages":"Please provide a valid name of the applicant guardian."}),
  relationWithApplicant: Joi.string().messages({ "messages":"Please provide a valid name of the applicant guardian."}),
  phoneOfGuardian: Joi.string().pattern(phoneNumber).messages({ "messages":"Please provide a valid phone number of the applicant guardian."}),
  hobbies: Joi.array().items(Joi.string()).required(),
  habits: Joi.array().items(Joi.string()).required(),
  otherInfo: Joi.string().messages({ "messages":'Please provide a valid other information.'}),
  livingAbroad: Joi.boolean()
    .required()
    .messages({ "messages":'Please provide an answer if you livingAbroad or not.'}),
})