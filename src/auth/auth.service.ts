import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schemas/User.schema";
import mongoose, { Model } from "mongoose";
import { SignupDto } from "./Dtos/signup.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import { MailerService } from "@nestjs-modules/mailer";
import { VerifyDto } from "./Dtos/verify.dto";
import { BadRequestException } from "@nestjs/common";
import { CompleteRegDto } from "./Dtos/completeReg.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./Dtos/login.dto";
import { comparePass, hashPass } from "../shared/utils/bcrypt.util";
import { AdminDto } from "./Dtos/admin.dto";
import { Admin } from "../schemas/Admin.schema";
import { UserDto } from "./Dtos/user.dto";
import { UpdatePassDto } from "./Dtos/updatePass.DTO";
import { ForgotPasswordDTO } from "./Dtos/forgotPassword.DTO";
import { Sprint1DTO } from "./Dtos/sprint1.DTO";
import { Sprint2DTO } from "./Dtos/sprint2.DTO";
import { Sprint3DTO } from "./Dtos/sprint3.DTO";
import { Sprint4DTO } from "./Dtos/sprint4.DTO";
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model <User>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailer_service: MailerService,
    private readonly jwt_service: JwtService
    ) {}
  async checkEmail(userEmail: string){
    const existingUser = await this.userModel.findOne({ email: userEmail });
    const existingAdmin = await this.adminModel.findOne({ email: userEmail });
    if (existingUser || existingAdmin) {
      throw new BadRequestException('الحساب موجود بالفعل');
    }
  }
  async checkPhone(phone: string){
    const existingUser = await this.userModel.findOne({ phone, isCompleted: true });
    if (existingUser)
      throw new BadRequestException('رقم الهاتف موجود بالفعل');
  }
  async initiateRegistration(signupDto: SignupDto): Promise<string>{
    await this.checkEmail(signupDto.email);
    await this.checkPhone(signupDto.phone);
    const verificationCode : string = Math.random().toString().substring(7, 12);
    await this.storeVerificationData(verificationCode, signupDto);
    return verificationCode;
  }
  async resendVerificationCode(email: string){
    const storeVerification = await this.cacheManager.get(`verification-${email}`) as {
      verification: string;
      email: string;
      phone: string;
      password: string
    };
    await this.sendVerificationEmail(storeVerification.verification, email);
  }
  async storeVerificationData(verificationCode: string, signupDto: SignupDto): Promise<void>{
    const hashPassword: string = await hashPass(signupDto.password);
    const verificationData = {
      verification: verificationCode,
      email: signupDto.email,
      phone: signupDto.phone,
      password: hashPassword
    };

    await this.cacheManager.set(`verification-${signupDto.email}`, verificationData );
  }
  async sendVerificationEmail(verificationCode: string, email: string): Promise<any>{
    await this.mailer_service.sendMail({
      to: email,
      subject: 'verification code',
      html: ` Hello,

      Thank you for registering with our application. To complete your registration, please use the following verification code: 
     <br><br>
      Verification Code: ${verificationCode}
      <br><br>
      If you did not request this verification code, please ignore this email.

      Best regards,
      Your Application Team`
    })
  }
  async verify(verifyDto: VerifyDto): Promise<string>{
    const storeVerification = await this.cacheManager.get(`verification-${verifyDto.email}`) as {
      verification: string;
      email: string;
      phone: string
      password: string
    };
    if(storeVerification == undefined || storeVerification.email != verifyDto.email)
      throw new BadRequestException("wrong Email");

    if(storeVerification.verification != verifyDto.verification )
      throw new BadRequestException("wrong verify code");

    const createUser = await this.userModel.create({
      email: storeVerification.email,
      phone: storeVerification.phone,
      password: storeVerification.password
    })
    const user = await createUser.save();
    const token: string = await this.createToken(user._id);
    return token;
  }
  async removeRegistrationData(email: string): Promise<void> {
    await this.cacheManager.del(`registration-${email}`);
  }
  async sprint1(id: string, sprint1: Sprint1DTO) {
    const form: any = {}
    form.firstName = sprint1.firstName;
    form.midName = sprint1.midName;
    form.lastName = sprint1.lastName;
    form.age = sprint1.age;
    form.gender = sprint1.gender;
    form.DOB = sprint1.DOB;
    form.nationality = sprint1.nationality;
    form.governorate = sprint1.governorate;
    form.city = sprint1.city;
    form.region = sprint1.region;
    form.address = sprint1.address;
    form.phone = sprint1.phone;
    form.sprint1 = true;
    const user = await this.userModel.findByIdAndUpdate(id,
      form
      , { new: true } )
    return user
  }

  async sprint2(id: string, sprint2: Sprint2DTO) {
    const form: any = {}
    form.club = sprint2.club;
    form.qualification = sprint2.qualification;
    form.school = sprint2.school;
    form.schoolType = sprint2.schoolType;
    form.college = sprint2.college;
    form.university = sprint2.university;
    form.specialization = sprint2.specialization;
    form.religion = sprint2.religion;
    form.sprint2 = true;
    const user = await this.userModel.findByIdAndUpdate(id,
      form
      , { new: true } )
    return user
  }

  async sprint3(id: string, sprint3: Sprint3DTO) {
    const form: any = {}
    form.height = sprint3.height;
    form.weight = sprint3.weight;
    form.skinColor = sprint3.skinColor;
    form.nameOfTheApplicantGuardian = sprint3.nameOfTheApplicantGuardian
    form.relationWithApplicant = sprint3.relationWithApplicant
    form.phoneOfGuardian = sprint3.phoneOfGuardian
    form.hobbies = sprint3.hobbies
    form.habits = sprint3.habbits
    form.otherInfo = sprint3.otherInfo
    form.sprint3 = true;
    const user = await this.userModel.findByIdAndUpdate(id,
      form
      , { new: true } )
    return user
  }

  async sprint4(id: string, sprint4: Sprint4DTO) {
    const currentDate: Date = new Date();
    const formattedRegistrationDate: string = currentDate.toISOString().slice(0, 10);
    const form: any = {}
    form.permanentDiseases = sprint4.permanentDiseases === "true";
    form.permanentDiseasesDetails = sprint4.permanentDiseasesDetails;
    form.disability =  sprint4.disability === "true";
    form.disabilityDetails = sprint4.disabilityDetails;
    form.car = sprint4.car === "true"
    form.carModel = sprint4.carModel
    form.carType = sprint4.carType
    form.apartment = sprint4.apartment === "true"
    form.space = sprint4.space
    form.site = sprint4.site
    form.businessOwner = sprint4.businessOwner === "true"
    form.businessType = sprint4.businessType
    form.job = sprint4.job === "true"
    form.jobTitle = sprint4.jobTitle
    form.jobCompany = sprint4.jobCompany
    form.marriedBefore = sprint4.marriedBefore === "true"
    form.marriedNow = sprint4.marriedNow === "true"
    form.children = sprint4.children === "true"
    form.numberOfChildren = sprint4.numberOfChildren
    form.agesOfChildren = sprint4.agesOfChildren
    form.livingAbroad = sprint4.livingAbroad === "true"
    form.languages = sprint4.languages;
    if(sprint4.faceImage)
      form.faceImage = sprint4.faceImage;
    if(sprint4.fullImage1 != "undefined"){
      if(sprint4.fullImage1 == "null")
        form.fullImage1 = null;
      else
        form.fullImage1 = sprint4.fullImage1;
    }
    if(sprint4.fullImage2 != "undefined")
      if(sprint4.fullImage2 == "null")
        form.fullImage2 = null;
      else
        form.fullImage2 = sprint4.fullImage2;
    if(sprint4.fullImage3 != "undefined")
      if(sprint4.fullImage3 == "null")
        form.fullImage3 = null;
      else
        form.fullImage3 = sprint4.fullImage3;
    if(sprint4.fullImage4 != "undefined")
      if(sprint4.fullImage4 == "null")
        form.fullImage4 = null;
      else
        form.fullImage4 = sprint4.fullImage4;
    if(sprint4.fullImage5 != "undefined")
      if(sprint4.fullImage5 == "null")
        form.fullImage5 = null;
      else
        form.fullImage5 = sprint4.fullImage5;
    if(sprint4.idImage)
      form.idImage = sprint4.idImage;
    // manWithIdImage:completeReg.manWithIdImage,
    form.isCompleted = true;
    form.registrationDate = formattedRegistrationDate;
    form.warning = "";
    form.sprint4 = true;
    const user = await this.userModel.findByIdAndUpdate(id,
      form
      , { new: true } )
    return user
  }
  async completeRegistration(id: string ,completeReg: CompleteRegDto){
    const currentDate: Date = new Date();
    const formattedRegistrationDate: string = currentDate.toISOString().slice(0, 10);
    const form: any = {}
    form.firstName = completeReg.firstName;
    form.midName = completeReg.midName;
    form.lastName = completeReg.lastName;
    form.age = completeReg.age;
    form.gender = completeReg.gender;
    form.DOB = completeReg.DOB;
    form.nationality = completeReg.nationality;
    form.governorate = completeReg.governorate;
    form.city = completeReg.city;
    form.region = completeReg.region;
    form.address = completeReg.address;
    form.phone = completeReg.phone;
    form.club = completeReg.club;
    form.qualification = completeReg.qualification;
    form.school = completeReg.school;
    form.schoolType = completeReg.schoolType;
    form.college = completeReg.college;
    form.university = completeReg.university;
    form.specialization = completeReg.specialization;
    form.languages = completeReg.languages;
    form.religion = completeReg.religion;
    form.height = completeReg.height;
    form.weight = completeReg.weight;
    form.skinColor = completeReg.skinColor;
    form.permanentDiseases = completeReg.permanentDiseases === "true";
    form.permanentDiseasesDetails = completeReg.permanentDiseasesDetails;
    form.disability =  completeReg.disability === "true";
    form.disabilityDetails = completeReg.disabilityDetails;
    if(completeReg.faceImage)
      form.faceImage = completeReg.faceImage;
    if(completeReg.fullImage1 != "undefined"){
      if(completeReg.fullImage1 == "null")
        form.fullImage1 = null;
      else
        form.fullImage1 = completeReg.fullImage1;
    }
    if(completeReg.fullImage2 != "undefined")
      if(completeReg.fullImage2 == "null")
        form.fullImage2 = null;
      else
        form.fullImage2 = completeReg.fullImage2;
    if(completeReg.fullImage3 != "undefined")
      if(completeReg.fullImage3 == "null")
        form.fullImage3 = null;
      else
        form.fullImage3 = completeReg.fullImage3;
    if(completeReg.fullImage4 != "undefined")
      if(completeReg.fullImage4 == "null")
        form.fullImage4 = null;
      else
        form.fullImage4 = completeReg.fullImage4;
    if(completeReg.fullImage5 != "undefined")
      if(completeReg.fullImage5 == "null")
        form.fullImage5 = null;
      else
        form.fullImage5 = completeReg.fullImage5;
    if(completeReg.idImage)
      form.idImage = completeReg.idImage;
    form.languages = completeReg.languages;
    // manWithIdImage:completeReg.manWithIdImage,
    form.car = completeReg.car === "true"
    form.carModel = completeReg.carModel
    form.carType = completeReg.carType
    form.apartment = completeReg.apartment === "true"
    form.space = completeReg.space
    form.site = completeReg.site
    form.businessOwner = completeReg.businessOwner === "true"
    form.businessType = completeReg.businessType
    form.job = completeReg.job === "true"
    form.jobTitle = completeReg.jobTitle
    form.jobCompany = completeReg.jobCompany
    form.marriedBefore = completeReg.marriedBefore === "true"
    form.marriedNow = completeReg.marriedNow === "true"
    form.children = completeReg.children === "true"
    form.numberOfChildren = completeReg.numberOfChildren
    form.agesOfChildren = completeReg.agesOfChildren
    form.nameOfTheApplicantGuardian = completeReg.nameOfTheApplicantGuardian
    form.relationWithApplicant = completeReg.relationWithApplicant
    form.phoneOfGuardian = completeReg.phoneOfGuardian
    form.hobbies = completeReg.hobbies
    form.habits = completeReg.habbits
    form.otherInfo = completeReg.otherInfo
    form.livingAbroad = completeReg.livingAbroad === "true"
    form.isCompleted = true;
    form.registrationDate = formattedRegistrationDate;
    form.warning = "";
    const user = await this.userModel.findByIdAndUpdate(id,
      form
    , { new: true } )
    return user
  }
  async login(loginDto: LoginDto): Promise<any> {
    const res = {token: "", client: {}};
    const user = await this.userModel.findOne({ email: loginDto.email });
    const admin = await this.adminModel.findOne({ email: loginDto.email });
    if (user != null) {
        await comparePass(loginDto.password, user.password);  // Option 1 (await)
        res.token = await this.createToken(user._id);
        res.client = user;

    }else if(admin != null){
        await comparePass(loginDto.password, admin.password);  // Option 1 (await)
        res.token = await this.createToken(admin._id);
        res.client = admin;
    }else{
      throw new BadRequestException("wrong email");
    }
    return res;
  }
  async emailLogin(email: string) {
    const res = {token: "", client: {}};
    const user = await this.userModel.findOne({ email: email });
    res.token = await this.createToken(user._id);
    res.client = user;
    return res;
  }
  async createAdmin(adminDto: AdminDto): Promise<string>{
    await this.checkEmail(adminDto.email);
    adminDto.password = await hashPass(adminDto.password);
    const createAdmin = await this.adminModel.create(adminDto);
    await createAdmin.save();
    return "admin created successfully";
  }
  async createToken(userId: mongoose.Types.ObjectId): Promise<string> {
    const payload:{id: mongoose.Types.ObjectId} = { id: userId };
    const token: string = await this.jwt_service.signAsync(payload);
    return token;
  }

  async createUser(user: UserDto) {

    await this.checkEmail(user.email);
    await this.checkPhone(user.phone);
    const currentDate: Date = new Date();
    const formattedRegistrationDate: string = currentDate.toISOString().slice(0, 10);

    const form: any = {}
    form.firstName = user.firstName;
    form.midName = user.midName;
    form.lastName = user.lastName;
    form.age = user.age;
    form.gender = user.gender;
    form.DOB = user.DOB;
    form.nationality = user.nationality;
    form.governorate = user.governorate;
    form.city = user.city;
    form.region = user.region;
    form.address = user.address;
    form.phone = user.phone;
    form.club = user.club;
    form.qualification = user.qualification;
    form.school = user.school;
    form.schoolType = user.schoolType;
    form.college = user.college;
    form.university = user.university;
    form.specialization = user.specialization;
    form.languages = user.languages;
    form.religion = user.religion;
    form.height = user.height;
    form.weight = user.weight;
    form.skinColor = user.skinColor;
    form.permanentDiseases = user.permanentDiseases === "true";
    form.permanentDiseasesDetails = user.permanentDiseasesDetails;
    form.disability =  user.disability === "true";
    form.disabilityDetails = user.disabilityDetails;


    if(user.faceImage)
      form.faceImage = user.faceImage;

    if(user.fullImage1 != "undefined")
      user.fullImage1 == "null" ?
        form.fullImage1 = null :
        form.fullImage1 = user.fullImage1;

    if(user.fullImage2 != "undefined")
      user.fullImage2 == "null" ?
        form.fullImage2 = null :
        form.fullImage2 = user.fullImage2;

    if(user.fullImage3 != "undefined")
      user.fullImage3 == "null" ?
        form.fullImage3 = null :
        form.fullImage3 = user.fullImage3;

    if(user.fullImage4 != "undefined")
      user.fullImage4 == "null" ?
        form.fullImage4 = null :
        form.fullImage4 = user.fullImage4;

    if(user.fullImage5 != "undefined")
      user.fullImage5 == "null" ?
        form.fullImage5 = null :
        form.fullImage5 = user.fullImage5;

    if(user.idImage)
      form.idImage = user.idImage;

    form.languages = user.languages;
    form.car = user.car === "true";
    form.carModel = user.carModel;
    form.carType = user.carType;
    form.apartment = user.apartment === "true";
    form.space = user.space;
    form.site = user.site;
    form.businessOwner = user.businessOwner === "true";
    form.businessType = user.businessType;
    form.job = user.job === "true";
    form.jobTitle = user.jobTitle;
    form.jobCompany = user.jobCompany;
    form.marriedBefore = user.marriedBefore === "true";
    form.marriedNow = user.marriedNow === "true";
    form.children = user.children === "true";
    form.numberOfChildren = user.numberOfChildren;
    form.agesOfChildren = user.agesOfChildren;
    form.nameOfTheApplicantGuardian = user.nameOfTheApplicantGuardian;
    form.relationWithApplicant = user.relationWithApplicant;
    form.phoneOfGuardian = user.phoneOfGuardian;
    form.hobbies = user.hobbies;
    form.habits = user.habbits;
    form.otherInfo = user.otherInfo;
    form.livingAbroad = user.livingAbroad === "true";
    form.isCompleted = true;
    form.registrationDate = formattedRegistrationDate;
    form.warning = "";
    form.password = '00000000';
    form.email = user.email;
    form.isApprove = true;
    // manWithIdImage:completeReg.manWithIdImage,
    const createdUser = await this.userModel.create(form);
    await createdUser.save();
    return {message:  "user created successfully" };
  }
  async updateUser(id: mongoose.Types.ObjectId, user: UserDto) {
    const currentDate: Date = new Date();
    const formattedRegistrationDate: string = currentDate.toISOString().slice(0, 10);

    const form: any = {}
    form.firstName = user.firstName;
    form.midName = user.midName;
    form.lastName = user.lastName;
    form.age = user.age;
    form.gender = user.gender;
    form.DOB = user.DOB;
    form.nationality = user.nationality;
    form.governorate = user.governorate;
    form.city = user.city;
    form.region = user.region;
    form.address = user.address;
    form.phone = user.phone;
    form.club = user.club;
    form.qualification = user.qualification;
    form.school = user.school;
    form.schoolType = user.schoolType;
    form.college = user.college;
    form.university = user.university;
    form.specialization = user.specialization;
    form.languages = user.languages;
    form.religion = user.religion;
    form.height = user.height;
    form.weight = user.weight;
    form.skinColor = user.skinColor;
    form.permanentDiseases = user.permanentDiseases === "true";
    form.permanentDiseasesDetails = user.permanentDiseasesDetails;
    form.disability =  user.disability === "true";
    form.disabilityDetails = user.disabilityDetails;


    if(user.faceImage)
      form.faceImage = user.faceImage;

    if(user.fullImage1 != "undefined")
      user.fullImage1 == "null" ?
        form.fullImage1 = null :
        form.fullImage1 = user.fullImage1;

    if(user.fullImage2 != "undefined")
      user.fullImage2 == "null" ?
        form.fullImage2 = null :
        form.fullImage2 = user.fullImage2;

    if(user.fullImage3 != "undefined")
      user.fullImage3 == "null" ?
        form.fullImage3 = null :
        form.fullImage3 = user.fullImage3;

    if(user.fullImage4 != "undefined")
      user.fullImage4 == "null" ?
        form.fullImage4 = null :
        form.fullImage4 = user.fullImage4;

    if(user.fullImage5 != "undefined")
      user.fullImage5 == "null" ?
        form.fullImage5 = null :
        form.fullImage5 = user.fullImage5;

    if(user.idImage)
      form.idImage = user.idImage;

    form.languages = user.languages;
    form.car = user.car === "true";
    form.carModel = user.carModel;
    form.carType = user.carType;
    form.apartment = user.apartment === "true";
    form.space = user.space;
    form.site = user.site;
    form.businessOwner = user.businessOwner === "true";
    form.businessType = user.businessType;
    form.job = user.job === "true";
    form.jobTitle = user.jobTitle;
    form.jobCompany = user.jobCompany;
    form.marriedBefore = user.marriedBefore === "true";
    form.marriedNow = user.marriedNow === "true";
    form.children = user.children === "true";
    form.numberOfChildren = user.numberOfChildren;
    form.agesOfChildren = user.agesOfChildren;
    form.nameOfTheApplicantGuardian = user.nameOfTheApplicantGuardian;
    form.relationWithApplicant = user.relationWithApplicant;
    form.phoneOfGuardian = user.phoneOfGuardian;
    form.hobbies = user.hobbies;
    form.habits = user.habbits;
    form.otherInfo = user.otherInfo;
    form.livingAbroad = user.livingAbroad === "true";
    form.registrationDate = formattedRegistrationDate;
    form.password = '00000000';
    form.email = user.email;
    // manWithIdImage:completeReg.manWithIdImage,
    const userData = await this.userModel.findByIdAndUpdate(id,
      form
      , { new: true } )
    return userData
  }
  async forgetPassword(userEmail: string){
    const existingUser = await this.userModel.findOne({ email: userEmail });
    const existingAdmin = await this.adminModel.findOne({ email: userEmail });
    if (!existingUser && !existingAdmin) {
      throw new BadRequestException('الحساب غير موجود');
    }
    const verificationCode: string = Math.random().toString().substring(7, 12);
    const verificationData = {
      userEmail,
      verificationCode,
    }
    await this.cacheManager.set(`pass-${userEmail}`, verificationData);
    await this.forgetPasswordEmail(verificationData);
  }
  async verifyForgetPassword(forgotPass: ForgotPasswordDTO){
    const forgotPassData = await this.cacheManager.get(`pass-${forgotPass.email}`) as {
      userEmail: string;
      verificationCode: string;
    }
    if(forgotPass.verificationCode != forgotPassData.verificationCode)
      throw new BadRequestException("الرقم المدخل غير صحيح")
  }
  async forgetPasswordEmail(verificationData: any){
    await this.mailer_service.sendMail({
      to: verificationData.userEmail,
      subject: 'اعادة تسجيل الرقم السري',
      html: ` Hello,

      Thank you for registering with our application. To complete your registration, please use the following verification code: 
     <br><br>
      Verification Code: ${verificationData.verificationCode}
      <br><br>
      If you did not request this verification code, please ignore this email.

      Best regards,
      Your Application Team`
    })
  }

  async updatePassword(updatePass: UpdatePassDto) {
    const hashPassword: string = await hashPass(updatePass.password);
    const user = await this.userModel.findOneAndUpdate(
      {email: updatePass.email},
      {password: hashPassword}
    )
    if(!user)
      throw new BadRequestException("الحساب غير صحيح")
    console.log( {message: "password updated successfully" })
    return {message: "password updated successfully" }
  }



}
