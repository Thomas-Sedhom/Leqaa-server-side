import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schemas/User.schema";
import { Model } from "mongoose";
import { Admin } from "../schemas/Admin.schema";
import { Connection } from "../schemas/Connection.schema";
import { PendingConnection } from "../schemas/PendingConnection.schema";
import { UserService } from "../user/user.service";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private user_model: Model<User>,
    @InjectModel(Admin.name) private admin_model: Model<Admin>,
    @InjectModel(Connection.name) private connection_model: Model<Connection>,
    @InjectModel(PendingConnection.name) private pendingConnection_model: Model<PendingConnection>,
    private readonly user_service: UserService
  ) {}
  async findAdminById(id: string){
    const admin = await this.admin_model.findById(id);
    return admin;
  }
  async getNotApprovedUsers(){
    const users = await this.user_model.find({isApprove: false});
    return users;
  }
  async approvedUser(id: string){
    const user = await this.user_model.findByIdAndUpdate(
      id,
      { isApprove: true },
      { new: true }
    )
    return user;
  };
  async getUsersConnections() {
    const connections = await this.connection_model
      .find()
      .populate({
      path: 'userId1',
      select: '_id fullImage firstName lastName',
    })
      .populate({
        path: 'userId2',
        select: '_id fullImage firstName lastName',
      })
      .exec();
    console.log(connections)
    return connections;
  }
  async getUsersSentRequests() {
    const requests = await this.pendingConnection_model
      .find()
      .populate({
        path: 'sender',
        select: '_id fullImage firstName lastName',
      })
      .populate({
        path: 'receiver',
        select: '_id fullImage firstName lastName',
      })
      .exec();
    return requests;
  }
  async getUserById(id: string): Promise<any>{
    const user = await this.user_service.getUser(id);
    return user
  }
}
