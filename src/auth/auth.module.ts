import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schemas/User.schema";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { FirebaseModule } from "../firebase/firebase.module";
import { UserModule } from "../user/user.module";
import { Admin, AdminSchema } from "../schemas/Admin.schema";
import { AdminModule } from "../admin/admin.module";
@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports:[
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    MongooseModule.forFeature([
        {name: User.name, schema: UserSchema},
        {name: Admin.name, schema: AdminSchema}
    ],
    ),
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_KEY,
      signOptions: { expiresIn: process.env['TOKEN_EXPIRE_TIME']},
    }),
    FirebaseModule,
    UserModule,
    AdminModule
  ]
})
export class AuthModule {}
