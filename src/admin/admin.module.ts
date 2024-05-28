import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schemas/User.schema";
import { UserModule } from "../user/user.module";
import { Admin, AdminSchema } from "../schemas/Admin.schema";
import { ContactModule } from "../contact/contact.module";
import { AuthModule } from "../auth/auth.module";


@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports:[
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
      {name: Admin.name, schema: AdminSchema},
    ]),
    UserModule,

  ],
  exports:[AdminService]
})
export class AdminModule {}
