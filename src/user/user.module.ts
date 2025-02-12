import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schemas/User.schema";
import { Connection, ConnectionSchema } from "../schemas/Connection.schema";
import { PendingConnection, PendingConnectionSchema } from "../schemas/PendingConnection.schema";
import { RejectedConnection, RejectedConnectionSchema } from "../schemas/rejectedConnection.schema";
import { Banner, BannerSchema } from "../schemas/banner.schema";
import { RemovedPendingConnection, RemovedPendingConnectionSchema } from "../schemas/removedPendingConnection.schema";

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema },
      {name: Connection.name, schema: ConnectionSchema },
      {name: PendingConnection.name, schema: PendingConnectionSchema },
      {name: RemovedPendingConnection.name, schema: RemovedPendingConnectionSchema },
      {name: RejectedConnection.name, schema: RejectedConnectionSchema },
      {name: Banner.name, schema: BannerSchema },
    ]),
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}
