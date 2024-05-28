import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schemas/User.schema";
import { Connection, ConnectionSchema } from "../schemas/Connection.schema";
import { PendingConnection, PendingConnectionSchema } from "../schemas/PendingConnection.schema";

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema },
      {name: Connection.name, schema: ConnectionSchema },
      {name: PendingConnection.name, schema: PendingConnectionSchema }
    ]),
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}
