import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from "@nestjs/mongoose";
// import * as process from "process";
import { ConfigModule } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { CacheModule } from "@nestjs/cache-manager";
import { JwtModule } from "@nestjs/jwt";
import { FirebaseModule } from './firebase/firebase.module';
// import process from "process";
// import process from "process";
// import * as dotenv from 'dotenv';
@Module({
  imports: [

    UserModule,
    AdminModule,
    ContactModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MailerModule.forRoot({
      transport: {
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "4e0951b2e03417",
          pass: "73e2f03d1ce31d"
        }
      },
      defaults: {
        from: "outd8rs@gmail.com"
      }
    }),
    CacheModule.register({
      store: process.env.CACHE_STORE || 'memory', // Use environment variable or default to memory
      ttl: 1000*60*10*60, // Cache data for 60 seconds by default
      isGlobal: true, // Make the cache globally accessible
    }),
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_KEY,
      signOptions: { expiresIn: process.env['TOKEN_EXPIRE_TIME']},
    }),
    FirebaseModule,
  ],
})
export class AppModule {}
