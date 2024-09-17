import {
  BadRequestException,
  Body,
  Controller, Get, Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors, UsePipes
} from "@nestjs/common";
import { SignupDto } from "./Dtos/signup.dto";
import { AuthService } from "./auth.service";
import { VerifyDto } from "./Dtos/verify.dto";
import { CompleteRegDto } from "./Dtos/completeReg.dto";
import { Response } from "express";
import { AuthGuard } from "../shared/guards/auth.guard";
import { CustomRequest } from '../shared/interfaces/custom-request.interface';
import { FirebaseService } from "../firebase/firebase.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { LoginDto } from "./Dtos/login.dto";
import { IsCompletedUserGuard } from "../shared/guards/isCompletedUser.guard";
import { AdminDto } from "./Dtos/admin.dto";
import { SuperAdminGuard } from "../shared/guards/super.guard";
import { JoiValidationPipe } from "../shared/pipes/joiValidation.pipe";
import { AdminJoiSchema } from "../schemas/Admin.schema";
import { UserDto } from "./Dtos/user.dto";
import { AdminGuard } from "../shared/guards/admin.guard";
import { UpdatePassDto } from "./Dtos/updatePass.DTO";
import mongoose from "mongoose";
import { ForgotPasswordDTO } from "./Dtos/forgotPassword.DTO";
import { Sprint1DTO } from "./Dtos/sprint1.DTO";
import { Sprint2DTO } from "./Dtos/sprint2.DTO";
import { Sprint3DTO } from "./Dtos/sprint3.DTO";
import { Sprint4DTO } from "./Dtos/sprint4.DTO";
import { UpdatePassByPhoneDto } from "./Dtos/updatePassByPhone.dto";
@Controller('auth')
export class AuthController {
  constructor(private readonly auth_service: AuthService, private readonly firebase_service: FirebaseService) {}
  @Post("signup")
  async signup(@Body() signUpDto: SignupDto): Promise<string> {
    await this.auth_service.initiateRegistration(signUpDto);
    return "check your email";
  }
  @Post("verify")
  async verify(@Body() verifyDto: VerifyDto, @Res() res: Response): Promise<void>{
    const token: string = await this.auth_service.verify(verifyDto)
    console.log(verifyDto.email)
    await this.auth_service.removeRegistrationData(verifyDto.email)
    res.cookie("jwt", token, {
      maxAge: 60 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
      partitioned: true
    });
    res.json({ token });
  }
  // @Post('resendCode')
  // async resendCode(@Body('email') email: string): Promise<string>{
  //   try{
  //     await this.auth_service.resendVerificationCode(email);
  //     return "code resent successfully";
  //   }catch (err){
  //     return err
  //   }
  // }

  @Post('resendCode')
  async resendCode(@Body('email') email: string): Promise<any>{
    try{
      const OTP = await this.auth_service.resendVerificationCode(email);
      return {OTP};
    }catch (err){
      return err
    }
  }
  @Post("sprint1")
  @UseGuards(AuthGuard)
  @UseGuards(IsCompletedUserGuard)
  async sprint1(
    @Body() sprint1: Sprint1DTO,
    @Req() req: CustomRequest,
    @Res() res: Response
  ){
    try{
      console.log(sprint1)
      await this.auth_service.sprint1(req.user._id, sprint1)
      res.json("sprint1 completed successfully")
    }catch (error){
      res.json(error)
    }
  }
  @Post("sprint2")
  @UseGuards(AuthGuard)
  @UseGuards(IsCompletedUserGuard)
  async sprint2(
    @Body() sprint2: Sprint2DTO,
    @Req() req: CustomRequest,
    @Res() res: Response
  ){
    try{
      await this.auth_service.sprint2(req.user._id, sprint2)
      res.json("sprint2 completed successfully")
    }catch (error){
      res.json(error)
    }
  }
  @Post("sprint3")
  @UseGuards(AuthGuard)
  @UseGuards(IsCompletedUserGuard)
  async sprint3(
    @Body() sprint3: Sprint3DTO,
    @Req() req: CustomRequest,
    @Res() res: Response
  ){
    try{
      await this.auth_service.sprint3(req.user._id, sprint3)
      res.json("sprint3 completed successfully")
    }catch (error){
      res.json(error)
    }
  }
  @Post("sprint4")
  @UseGuards(AuthGuard)
  @UseGuards(IsCompletedUserGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'faceImage', maxCount: 1 },
    { name: 'fullImage1', maxCount: 1 },
    { name: 'fullImage2', maxCount: 1 },
    { name: 'fullImage3', maxCount: 1 },
    { name: 'fullImage4', maxCount: 1 },
    { name: 'fullImage5', maxCount: 1 },
    { name: 'idImage', maxCount: 1 },
    // { name: 'manWithIdImage', maxCount: 1 },
  ]))
  async sprint4(
    @Body() sprint4: Sprint4DTO,
    @UploadedFiles() files: {
      faceImage?: Express.Multer.File[],
      fullImage1?: Express.Multer.File[],
      fullImage2?: Express.Multer.File[],
      fullImage3?: Express.Multer.File[],
      fullImage4?: Express.Multer.File[],
      fullImage5?: Express.Multer.File[],
      idImage?: Express.Multer.File[],
    },
    @Req() req: CustomRequest,
    @Res() res: Response
  ) {
    const startTime = Date.now();

    try {
      const uploadPromises = [];

      if (files.faceImage) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.faceImage, `\`${req.user.id}\`/`)
            .then((url) => { sprint4.faceImage = url; })
        );
      }
      if (files.fullImage1) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.fullImage1, `\`${req.user.id}\`/`)
            .then((url) => { sprint4.fullImage1 = url; })
        );
      }
      if (files.fullImage2) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.fullImage2, `\`${req.user.id}\`/`)
            .then((url) => { sprint4.fullImage2 = url; })
        );
      }
      if (files.fullImage3) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.fullImage3, `\`${req.user.id}\`/`)
            .then((url) => { sprint4.fullImage3 = url; })
        );
      }
      if (files.fullImage4) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.fullImage4, `\`${req.user.id}\`/`)
            .then((url) => { sprint4.fullImage4 = url; })
        );
      }
      if (files.fullImage5) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.fullImage5, `\`${req.user.id}\`/`)
            .then((url) => { sprint4.fullImage5 = url; })
        );
      }
      if (files.idImage) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.idImage, `\`${req.user.id}\`/`)
            .then((url) => { sprint4.idImage = url; })
        );
      }
      const uploadResults = await Promise.allSettled(uploadPromises);

      uploadResults.forEach((result, index) => {
        if (result.status === "rejected") {
          throw new BadRequestException(`Upload failed: ${result.reason}`);
          // Optionally, you can add logic here to handle retries or mark which files failed.
        } else {
          console.log(`Upload succeeded with status : ${result.status}`);
        }
      });

      // Proceed with updating the sprint4 information regardless of individual upload failures.
      await this.auth_service.sprint4(req.user._id, sprint4);
      res.json({
        message: "Data completed successfully, wait for approved profile",
        failedUploads: uploadResults.filter(result => result.status === "rejected").length,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    } finally {
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      console.log(`sprint4 endpoint executed in ${timeTaken} ms`);
    }
  }
  @Post("completeRegistration")
  @UseGuards(AuthGuard)
  @UseGuards(IsCompletedUserGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'faceImage', maxCount: 1 },
    { name: 'fullImage1', maxCount: 1 },
    { name: 'fullImage2', maxCount: 1 },
    { name: 'fullImage3', maxCount: 1 },
    { name: 'fullImage4', maxCount: 1 },
    { name: 'fullImage5', maxCount: 1 },
    { name: 'idImage', maxCount: 1 },
    // { name: 'manWithIdImage', maxCount: 1 },
  ]))
  async completeRegistration(
    @Body() completeReg: CompleteRegDto,
    @UploadedFiles() files: {
      faceImage?: Express.Multer.File[],
      fullImage1?: Express.Multer.File[],
      fullImage2?: Express.Multer.File[],
      fullImage3?: Express.Multer.File[],
      fullImage4?: Express.Multer.File[],
      fullImage5?: Express.Multer.File[],
      idImage?: Express.Multer.File[],
      // manWithIdImage?: Express.Multer.File[]
    },
    @Req() req: CustomRequest,
    @Res() res: Response
  ){
    try{
      // const allowedExtensionsRegex: RegExp = /\.(jpeg|jpg|png)$/;
      // const imagePipe: ParseFilePipe = new ParseFilePipe({
      //   validators: [new FileTypeValidator({ fileType: allowedExtensionsRegex }),],
      // });
      // await imagePipe.transform(files.faceImage)
      // await imagePipe.transform(files.fullImage)
      // await imagePipe.transform(files.idImage)
      // await imagePipe.transform(files.manWithIdImage)
      if(files.faceImage != undefined){
        const faceImageUrl: string| undefined = await this.firebase_service.uploadImageToCloud(files.faceImage, `\`${req.user.id}\`/`);
        completeReg.faceImage = faceImageUrl;
      }
      if(files.fullImage1 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage1, `\`${req.user.id}\`/`);
        completeReg.fullImage1 = fullImageUrl;
      }
      if(files.fullImage2 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage2, `\`${req.user.id}\`/`);
        completeReg.fullImage2 = fullImageUrl;
      }
      if(files.fullImage3 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage3, `\`${req.user.id}\`/`);
        completeReg.fullImage3 = fullImageUrl;
      }
      if(files.fullImage4 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage4, `\`${req.user.id}\`/`);
        completeReg.fullImage4 = fullImageUrl;
      }
      if(files.fullImage5 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage5, `\`${req.user.id}\`/`);
        completeReg.fullImage5 = fullImageUrl;
      }
      if(files.idImage != undefined){
        const idImageUrl: any = await this.firebase_service.uploadImageToCloud(files.idImage, `\`${req.user.id}\`/`);
        completeReg.idImage = idImageUrl;
      }
      // const manWithIdImageUrl: any = await this.firebase_service.uploadImageToCloud(files.manWithIdImage, `\`${req.user.id}\`/`);
      // completeReg.manWithIdImage = manWithIdImageUrl;
      console.log(files.fullImage1, files.fullImage2, files.fullImage3, files.fullImage4, files.fullImage5)
      if(files.fullImage1 === null) completeReg.fullImage1 = null
      if(files.fullImage2 === null) completeReg.fullImage2 = null
      if(files.fullImage3 === null) completeReg.fullImage3 = null
      if(files.fullImage4 === null) completeReg.fullImage4 = null
      if(files.fullImage5 === null) completeReg.fullImage5 = null
      console.log(completeReg)
      await this.auth_service.completeRegistration(req.user._id,completeReg)
      res.json("data completed successfully, wait for approved profile")
    }catch (error){
      res.json(error)
    }
  }
  @UseGuards(AuthGuard)
  @Get("getSprintsStatus")
  async getSprintsStatus(@Req() req: CustomRequest): Promise<any>{
    try{
      const status = {
        sprint1: req.user.sprint1,
        sprint2: req.user.sprint2,
        sprint3: req.user.sprint3,
        sprint4: req.user.sprint4
      };
      console.log(status)
      return status
    }catch (err){
      return err;
    }
  }
  @UseGuards(AuthGuard)
  @Get("getUserPhone")
  async getUserPhone(@Req() req: CustomRequest): Promise<any>{
    try{
      return req.user.phone;
    }catch (err){
      return err;
    }
  }
  @UseGuards(AuthGuard)
  @Get("gender")
  async gender(@Req() req: CustomRequest): Promise<any>{
    try{
      return req.user.gender;
    }catch (err){
      return err;
    }
  }

  @UseGuards(AuthGuard)
  @UseGuards(IsCompletedUserGuard)
  @Get("warning")
  async getWarning(@Req() req: CustomRequest): Promise<string>{
    const userWarning: string = req.user.warning;
    return userWarning
  }
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void>{
    try{
      const resp = await this.auth_service.login(loginDto);
      res.cookie('jwt', resp.token,
        {
          maxAge: 60 * 60 * 60 * 1000,
          sameSite: "none",
          secure: true,
          partitioned: true
        })
      res.send(resp.client)
    }catch (error){
      res.send(error)
    }
  }

  @Post("emailLogin")
  // @UseGuards(AdminGuard)
  async emailLogin(@Body() email: any, @Res() res: Response): Promise<void>{
    try{
      console.log(email)
      const resp = await this.auth_service.emailLogin(email.email);
      res.cookie('jwt', resp.token,
        {
          maxAge: 60 * 60 * 60 * 1000,
          sameSite: "none",
          secure: true,
          partitioned: true
        })
      res.send(resp.client)
    }catch (error){
      res.send(error)
    }
  }
  @Post("admin")
  @UsePipes(new JoiValidationPipe(AdminJoiSchema))
  @UseGuards(SuperAdminGuard)
  async admin(@Body() adminDto: AdminDto): Promise<string>{
    try{
      const createAdmin: string = await this.auth_service.createAdmin(adminDto);
      return createAdmin
    }catch (err){
      return err;
    }
  }
  @UseGuards(AdminGuard)
  @Post("user")
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'faceImage', maxCount: 1 },
    { name: 'fullImage1', maxCount: 1 },
    { name: 'fullImage2', maxCount: 1 },
    { name: 'fullImage3', maxCount: 1 },
    { name: 'fullImage4', maxCount: 1 },
    { name: 'fullImage5', maxCount: 1 },
    { name: 'idImage', maxCount: 1 },
    // { name: 'manWithIdImage', maxCount: 1 },
  ]))
  async user(
    @Body() user: UserDto,
    @UploadedFiles() files: {
      faceImage?: Express.Multer.File[],
      fullImage1?: Express.Multer.File[],
      fullImage2?: Express.Multer.File[],
      fullImage3?: Express.Multer.File[],
      fullImage4?: Express.Multer.File[],
      fullImage5?: Express.Multer.File[],
      idImage?: Express.Multer.File[],
      // manWithIdImage?: Express.Multer.File[]
    },
  ){
    try{
      if(files.faceImage != undefined){
        const faceImageUrl: string| undefined = await this.firebase_service.uploadImageToCloud(files.faceImage, `\`${user.email}\`/`);
        user.faceImage = faceImageUrl;
      }
      if(files.fullImage1 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage1, `\`${user.email}\`/`);
        user.fullImage1 = fullImageUrl;
      }
      if(files.fullImage2 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage2, `\`${user.email}\`/`);
        user.fullImage2 = fullImageUrl;
      }
      if(files.fullImage3 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage3, `\`${user.email}\`/`);
        user.fullImage3 = fullImageUrl;
      }
      if(files.fullImage4 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage4, `\`${user.email}\`/`);
        user.fullImage4 = fullImageUrl;
      }
      if(files.fullImage5 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage5, `\`${user.email}\`/`);
        user.fullImage5 = fullImageUrl;
      }
      if(files.idImage != undefined){
        const idImageUrl: any = await this.firebase_service.uploadImageToCloud(files.idImage, `\`${user.email}\`/`);
        user.idImage = idImageUrl;
      }
      // const manWithIdImageUrl: any = await this.firebase_service.uploadImageToCloud(files.manWithIdImage, `\`${req.user.id}\`/`);
      // completeReg.manWithIdImage = manWithIdImageUrl;
      console.log(files.fullImage1, files.fullImage2, files.fullImage3, files.fullImage4, files.fullImage5)
      if(files.fullImage1 === null) user.fullImage1 = null
      if(files.fullImage2 === null) user.fullImage2 = null
      if(files.fullImage3 === null) user.fullImage3 = null
      if(files.fullImage4 === null) user.fullImage4 = null
      if(files.fullImage5 === null) user.fullImage5 = null
      const createUser = await this.auth_service.createUser(user);
      return createUser;
    }catch (err){
      return err;
    }
  }
  @UseGuards(AdminGuard)
  @Post("updateUser/:userId")
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'faceImage', maxCount: 1 },
    { name: 'fullImage1', maxCount: 1 },
    { name: 'fullImage2', maxCount: 1 },
    { name: 'fullImage3', maxCount: 1 },
    { name: 'fullImage4', maxCount: 1 },
    { name: 'fullImage5', maxCount: 1 },
    { name: 'idImage', maxCount: 1 },
    // { name: 'manWithIdImage', maxCount: 1 },
  ]))
  async updateUser(
    @Param('userId') userId: string,
    @Body() user: UserDto,
    @UploadedFiles() files: {
      faceImage?: Express.Multer.File[],
      fullImage1?: Express.Multer.File[],
      fullImage2?: Express.Multer.File[],
      fullImage3?: Express.Multer.File[],
      fullImage4?: Express.Multer.File[],
      fullImage5?: Express.Multer.File[],
      idImage?: Express.Multer.File[],
      // manWithIdImage?: Express.Multer.File[]
    },
  ){
    try{
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);
      if(files.faceImage != undefined){
        const faceImageUrl: string| undefined = await this.firebase_service.uploadImageToCloud(files.faceImage, `\`${user.email}\`/`);
        user.faceImage = faceImageUrl;
      }
      if(files.fullImage1 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage1, `\`${user.email}\`/`);
        user.fullImage1 = fullImageUrl;
      }
      if(files.fullImage2 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage2, `\`${user.email}\`/`);
        user.fullImage2 = fullImageUrl;
      }
      if(files.fullImage3 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage3, `\`${user.email}\`/`);
        user.fullImage3 = fullImageUrl;
      }
      if(files.fullImage4 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage4, `\`${user.email}\`/`);
        user.fullImage4 = fullImageUrl;
      }
      if(files.fullImage5 != undefined){
        const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage5, `\`${user.email}\`/`);
        user.fullImage5 = fullImageUrl;
      }
      if(files.idImage != undefined){
        const idImageUrl: any = await this.firebase_service.uploadImageToCloud(files.idImage, `\`${user.email}\`/`);
        user.idImage = idImageUrl;
      }
      // const manWithIdImageUrl: any = await this.firebase_service.uploadImageToCloud(files.manWithIdImage, `\`${req.user.id}\`/`);
      // completeReg.manWithIdImage = manWithIdImageUrl;
      console.log(files.fullImage1, files.fullImage2, files.fullImage3, files.fullImage4, files.fullImage5)
      if(files.fullImage1 === null) user.fullImage1 = null
      if(files.fullImage2 === null) user.fullImage2 = null
      if(files.fullImage3 === null) user.fullImage3 = null
      if(files.fullImage4 === null) user.fullImage4 = null
      if(files.fullImage5 === null) user.fullImage5 = null
      const createUser = await this.auth_service.updateUser(id, user);
      return createUser;
    }catch (err){
      return err;
    }
  }
  @UseGuards(AdminGuard)
  @Post("completeUser/:userId")
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'faceImage', maxCount: 1 },
    { name: 'fullImage1', maxCount: 1 },
    { name: 'fullImage2', maxCount: 1 },
    { name: 'fullImage3', maxCount: 1 },
    { name: 'fullImage4', maxCount: 1 },
    { name: 'fullImage5', maxCount: 1 },
    { name: 'idImage', maxCount: 1 },
    // { name: 'manWithIdImage', maxCount: 1 },
  ]))
  async completeUser(
    @Param('userId') userId: string,
    @Body() user: UserDto,
    @UploadedFiles() files: {
      faceImage?: Express.Multer.File[],
      fullImage1?: Express.Multer.File[],
      fullImage2?: Express.Multer.File[],
      fullImage3?: Express.Multer.File[],
      fullImage4?: Express.Multer.File[],
      fullImage5?: Express.Multer.File[],
      idImage?: Express.Multer.File[],
      // manWithIdImage?: Express.Multer.File[]
    },
  ){
    const startTime = Date.now();
    try{
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);
      const uploadPromises = [];

      if (files.faceImage) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.faceImage, `\`${user.email}\`/`)
            .then((url) => { user.faceImage = url; })
        );
      }
      if (files.fullImage1) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.fullImage1, `\`${user.email}\`/`)
            .then((url) => { user.fullImage1 = url; })
        );
      }
      if (files.fullImage2) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.fullImage2, `\`${user.email}\`/`)
            .then((url) => { user.fullImage2 = url; })
        );
      }
      if (files.fullImage3) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.fullImage3, `\`${user.email}\`/`)
            .then((url) => { user.fullImage3 = url; })
        );
      }
      if (files.fullImage4) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.fullImage4, `\`${user.email}\`/`)
            .then((url) => { user.fullImage4 = url; })
        );
      }
      if (files.fullImage5) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.fullImage5, `\`${user.email}\`/`)
            .then((url) => { user.fullImage5 = url; })
        );
      }
      if (files.idImage) {
        uploadPromises.push(
          this.firebase_service.uploadImageToCloud(files.idImage, `\`${user.email}\`/`)
            .then((url) => { user.idImage = url; })
        );
      }
      const uploadResults = await Promise.allSettled(uploadPromises);

      uploadResults.forEach((result, index) => {
        if (result.status === "rejected") {
          throw new BadRequestException(`Upload failed: ${result.reason}`);
          // Optionally, you can add logic here to handle retries or mark which files failed.
        } else {
          console.log(`Upload succeeded with status : ${result.status}`);
        }
      });
      const createUser = await this.auth_service.completeUser(id, user);
      return createUser;
    }catch (err){
      return err;
    }finally {
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      console.log(`completeUser endpoint executed in ${timeTaken} ms`);
    }
  }
  @Post("forgetPassword")
  async forgetPassword(@Body("email") email: string ): Promise<any>{
    try{
      await this.auth_service.forgetPassword(email);
      return {message: `تم ارسال الايميل`}
    }catch(err){
      return err
    }
  }
  @Post("verifyForgetPassword")
  async verifyForgetPassword(@Body() forgotPass: ForgotPasswordDTO ): Promise<any>{
    try{
      await this.auth_service.verifyForgetPassword(forgotPass)
      console.log({message: `تم ادخال رقم التسجيل بنجاح`})
      return {message: `تم ادخال رقم التسجيل بنجاح`}
    }catch (err){
      return err
    }
  }
  @Post("updatePassword")
  async updatePassword(@Body() updatedPass: UpdatePassDto): Promise <any>{
    try{
      const updatePass = await this.auth_service.updatePassword(updatedPass);
      return updatePass
    }catch (error){
      return error;
    }
  }
  @Post("updatePasswordByPhone")
  async updatePasswordByPhone(@Body() data: UpdatePassByPhoneDto): Promise <any>{
    try{
      const updatePass = await this.auth_service.updatePasswordByPhone(data);
      return updatePass
    }catch (error){
      return error;
    }
  }
  @Get('logout')
  logout(@Res() res: Response): void {
    try {
      res.clearCookie('jwt');
      res.status(200).send("logout");
    } catch (err) {
      res.json(500).json(err.message);
    }
  }
}
//https://chatgpt.com/share/5f84a0aa-1cfc-492d-b361-6c1b5181075d