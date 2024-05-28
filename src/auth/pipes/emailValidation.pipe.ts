// import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
// import { AuthService } from "../auth.service";

// export class EmailValidationPipe implements PipeTransform{
//   constructor(private readonly auth_service: AuthService) {}
//   async transform(value: any, metadata: ArgumentMetadata): Promise<void> {
//     console.log(value)
//     if(value)
//       await this.auth_service.checkEmail("ddddd");
//   }
// }