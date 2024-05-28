import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schemas/User.schema";
import { Model } from "mongoose";
import { Admin } from "../schemas/Admin.schema";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private user_model: Model<User>,
    @InjectModel(Admin.name) private admin_model: Model<Admin>
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
  async getUsersConnections(): Promise<User[]> {
    const connections = await this.user_model.find(
      {  connections: { $exists: true }  },
      {_id: 1, firstName: 1, lastName: 1, fullImage: 1, connections: 1}

    );
    return connections;
  }
  async getUsersSentRequests(): Promise<User[]> {
    const requests = await this.user_model.find(
      { sentRequests: { $exists: true } },
      {_id: 1, firstName: 1, lastName: 1, fullImage: 1, sentRequests: 1}
    );
    return requests;
  }
}
