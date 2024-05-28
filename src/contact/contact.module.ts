import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Contact, ContactSchema } from "../schemas/Contact.schema";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { AdminModule } from "../admin/admin.module";

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [
    MongooseModule.forFeature([
      {name: Contact.name, schema: ContactSchema}
    ]),
    UserModule,
    AdminModule
  ],
  exports: [
    ContactService
  ]
})
export class ContactModule {}
