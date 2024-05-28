import {
  Body,
  Controller, FileTypeValidator, Get, ParseFilePipe,
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
    const token = await this.auth_service.verify(verifyDto)
    await this.auth_service.removeRegistrationData(verifyDto.email)
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 60 * 1000
    });
    res.send(token);
  }
  @UseGuards(AuthGuard)
  @UseGuards(IsCompletedUserGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'faceImage', maxCount: 1 },
    { name: 'fullImage', maxCount: 1 },
    { name: 'idImage', maxCount: 1 },
    { name: 'manWithIdImage', maxCount: 1 },
  ]))
  @Post("completeRegistration")
  async completeRegistration(
    @Body() completeReg: CompleteRegDto,
    @UploadedFiles() files: {
      faceImage?: Express.Multer.File[],
      fullImage?: Express.Multer.File[],
      idImage?: Express.Multer.File[],
      manWithIdImage?: Express.Multer.File[]
    },
    @Req() req: CustomRequest,
    @Res() res: Response
  ): Promise<void> {
    try{
      // const allowedExtensionsRegex: RegExp = /\.(jpeg|jpg|png)$/;
      // const imagePipe: ParseFilePipe = new ParseFilePipe({
      //   validators: [new FileTypeValidator({ fileType: allowedExtensionsRegex }),],
      // });
      // await imagePipe.transform(files.faceImage)
      // await imagePipe.transform(files.fullImage)
      // await imagePipe.transform(files.idImage)
      // await imagePipe.transform(files.manWithIdImage)

      const faceImageUrl: string| undefined = await this.firebase_service.uploadImageToCloud(files.faceImage, `\`${req.user.id}\`/`);
      const fullImageUrl: any = await this.firebase_service.uploadImageToCloud(files.fullImage, `\`${req.user.id}\`/`);
      const idImageUrl: any = await this.firebase_service.uploadImageToCloud(files.idImage, `\`${req.user.id}\`/`);
      const manWithIdImageUrl: any = await this.firebase_service.uploadImageToCloud(files.manWithIdImage, `\`${req.user.id}\`/`);

      completeReg.faceImage = faceImageUrl;
      completeReg.fullImage = fullImageUrl;
      completeReg.idImage = idImageUrl;
      completeReg.manWithIdImage = manWithIdImageUrl;

      await this.auth_service.completeRegistration(req.user._id,completeReg)
      res.send("data completed successfully, wait for approved profile")
    }catch (error){
      return error;
    }
  }
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void>{
    try{
      const token: string = await this.auth_service.login(loginDto);
      res.cookie('jwt', token,
        {
          httpOnly: true,
          maxAge: 60 * 60 * 60 * 1000
        })
      res.send(token)
    }catch (error){
      res.send(error.message)
    }
  }
  @UsePipes(new JoiValidationPipe(AdminJoiSchema))
  @UseGuards(SuperAdminGuard)
  @Post("admin")
  async admin(@Body() adminDto: AdminDto): Promise<string>{
    const createAdmin: string = await this.auth_service.createAdmin(adminDto);
    return createAdmin
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
