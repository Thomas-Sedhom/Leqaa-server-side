import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schemas/User.schema";
import { UserModule } from "../user/user.module";
import { Admin, AdminSchema } from "../schemas/Admin.schema";
import { Connection, ConnectionSchema } from "../schemas/Connection.schema";
import { PendingConnection, PendingConnectionSchema } from "../schemas/PendingConnection.schema";
import { RejectedConnection, RejectedConnectionSchema } from "../schemas/rejectedConnection.schema";
import { IncompleteConnection, IncompleteConnectionSchema } from "../schemas/incompleteConnection.schema";


@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports:[
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
      {name: Admin.name, schema: AdminSchema},
      {name: Connection.name, schema: ConnectionSchema },
      {name: PendingConnection.name, schema: PendingConnectionSchema },
      {name: RejectedConnection.name, schema: RejectedConnectionSchema },
      {name: IncompleteConnection.name, schema: IncompleteConnectionSchema},
    ]),
    UserModule,

  ],
  exports:[AdminService]
})
export class AdminModule {}
