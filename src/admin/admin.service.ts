import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schemas/User.schema";
import mongoose, { Model } from "mongoose";
import { Admin } from "../schemas/Admin.schema";
import { Connection } from "../schemas/Connection.schema";
import { PendingConnection } from "../schemas/PendingConnection.schema";
import { UserService } from "../user/user.service";
import { RejectedConnection } from "../schemas/rejectedConnection.schema";
import { MailerService } from "@nestjs-modules/mailer";
import { WarningEmailDTO } from "./DTOs/warningEmail.DTO";
import { PaginationDTO } from "../shared/DTOs/pagination.dto";
import { PaginationUtil } from "../shared/utils/pagination.util";
import { IncompleteConnection } from "../schemas/incompleteConnection.schema";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private user_model: Model<User>,
    @InjectModel(Admin.name) private admin_model: Model<Admin>,
    @InjectModel(Connection.name) private connection_model: Model<Connection>,
    @InjectModel(PendingConnection.name) private pendingConnection_model: Model<PendingConnection>,
    @InjectModel(RejectedConnection.name) private rejectedConnection_model: Model<RejectedConnection>,
    @InjectModel(IncompleteConnection.name) private incompleteConnection_model: Model<IncompleteConnection>,
    private readonly user_service: UserService,
    private readonly mailer_service: MailerService,
  ) {}
  async findAdminById(id: string){
    const admin = await this.admin_model.findById(id);
    return admin;
  }
  async getNotApprovedUsers(){
    const users = await this.user_model.find(
        {isApprove: false, isCompleted: true},
        {_id: 1, firstName: 1, lastName: 1, phone: 1, registrationDate: 1}
    );
    return users;
  }
  async approvedUser(id: string){
    const user = await this.user_model.findByIdAndUpdate(
      id,
      { isApprove: true, isCompleted: true, warning: "" },
      { new: true }
    )
    return user;
  };
  async getUsersConnections() {
    const connections = await this.connection_model
        .find({}, { connectionDate: 1, commission: 1 })
        .populate({
          path: 'userId1',
          select: '_id fullImage firstName lastName'
        })
        .populate({
          path: 'userId2',
          select: '_id fullImage firstName lastName'
        })
        .exec();
    return connections;
  }
  async getUsersRejectedConnections() {
    const rejectedConnections = await this.rejectedConnection_model
      .find({},{rejectDate: 1})
      .populate({
        path: 'sender',
        select: '_id fullImage firstName lastName'
      })
      .populate({
        path: 'receiver',
        select: '_id fullImage firstName lastName'
      })
      .exec();
    return rejectedConnections;
  }
  async getUsersSentRequests() {
    const requests = await this.pendingConnection_model
      .find({}, {requestDate: 1})
      .populate({
        path: 'sender',
        select: '_id firstName lastName',
      })
      .populate({
        path: 'receiver',
        select: '_id firstName lastName',
      })
      .exec();
    return requests;
  }
  async getUserById(id: string): Promise<any>{
    const user = await this.user_service.getAllUserDate(id);
    return user
  }
  async deleteUserById(id: string): Promise<string>{
    await this.user_service.deleteUserById(id);
    return "user rejected successfully";
  }
  async warningUser(id: string, warning: any): Promise<string> {
    const currentDate: Date = new Date();
    const formattedWarningDate: string = currentDate.toISOString().slice(0, 10);
    await this.user_model.findByIdAndUpdate(
        id,
        {
          isCompleted: false,
          sprint1: false,
          sprint2: false,
          sprint3: false,
          sprint4: false,
          warning: warning.warningInput,
          latestWarningDate: formattedWarningDate
        }
    ).exec();
    return "user warned successfully";
  }
  async getWarningUsers() {
    const users = await this.user_model.find({
      warning: { $exists: true, $ne: "" }
    }, {
      firstName: 1,
      lastName: 1,
      warning: 1,
      latestWarningDate: 1,
      phone: 1,
      _id: 1
    });
    return users;
  }
  async getAllUsers(){
    const  allUsers = await this.user_model.find({isCompleted: true, isApprove: true});
    return allUsers
  }

  async block(id: mongoose.Types.ObjectId) {
    await this.user_model.findByIdAndUpdate(
      id,
      {
        block: true,
        isHidden: true
      },
      {new: true}
    );
    return "user blocked successfully";
  }
  async unBlock(id: mongoose.Types.ObjectId) {
    await this.user_model.findByIdAndUpdate(
      id,
      {
        block: false,
        isHidden: false
      },
      {new: true}
    );
    return "user unBlocked successfully";
  }
  async removeRequest(id: mongoose.Types.ObjectId): Promise<string> {
    const pendingConnection = await this.pendingConnection_model.findByIdAndDelete(id);
    if(pendingConnection){
      const rejectedDate = new Date().toISOString().slice(0, 10);
      const rejectedConnections = await this.rejectedConnection_model.create({
        sender: pendingConnection.sender,
        receiver: pendingConnection.receiver,
        requestDate: pendingConnection.requestDate,
        rejectDate: rejectedDate
      })
      await rejectedConnections.save()
      console.log(rejectedConnections)
      return "rejected connection successfully";
    }
    return "Pending removed successfully";
  }
  async acceptRequest(userId1: mongoose.Types.ObjectId, userId2: mongoose.Types.ObjectId) {
    const pendingConnection: mongoose.mongo.DeleteResult = await this.pendingConnection_model.deleteOne(
      {
        sender: userId1,
        receiver: userId2
      }
    )
    if(pendingConnection.deletedCount == 1){
      const currentDate: Date = new Date();
      const formattedConnectionDate: string = currentDate.toISOString().slice(0, 10);
      await this.connection_model.create({
        userId1,
        userId2,
        connectionDate: formattedConnectionDate
      })
    }else{
      throw new BadRequestException("send connection request first")
    }
    return "accepted connection successfully";
  }

  async warningEmail(warningEmail: WarningEmailDTO) {
    await this.mailer_service.sendMail({
      to: warningEmail.email,
      subject: 'registration warning',
      html: `
 عميلنا العزيز      
       <span style="color: red; font-weight: bold;">${warningEmail.username}</span>
   بناء علي تسجيلك المسبق في منصة لقاء  يجب استكمال تلك الملاحظات :    
       <p style="color: red; font-weight: bold;">${warningEmail.message}</p]>
      `
    })
    return "email sent successfully"
  }

  async getAllAdmins(currentUserId: mongoose.Types.ObjectId): Promise <any> {
    const allAdmins = await this.admin_model.find({
      _id: {$ne: currentUserId},
    })
    return allAdmins
  }

  async deleteAdmin(id: mongoose.Types.ObjectId): Promise <any> {
    await this.admin_model.findByIdAndDelete(id);
    return {message: "user rejected successfully" };
  }

  async commission(id: mongoose.Types.ObjectId, commission: string) {
    await this.connection_model.findByIdAndUpdate(id, {commission})
  }

  async incompleteUsersCount(){
    const filter = {
      isCompleted: false,
      isApprove: false,
      warning: ""
    }
    const totalCount = await this.user_model.countDocuments(filter).exec();
    return totalCount;
  }
  async incompleteUsers(paginationQuery: PaginationDTO) {
    const filter = {
      isCompleted: false,
      isApprove: false,
      warning: ""
    }
    const incompleteUsers = await PaginationUtil(paginationQuery, this.user_model, filter);
    return incompleteUsers
  }

  async incompleteConnection(connectionId: mongoose.Types.ObjectId) {
    const connection = await this.connection_model.findByIdAndDelete(connectionId);
    const incompleteDate: string = new Date().toISOString().slice(0, 10);
    const incompleteconnection = await this.incompleteConnection_model.create({
      userId1: connection.userId1,
      userId2: connection.userId2,
      incompleteDate
    });
    await incompleteconnection.save();
    return incompleteconnection;
  }

  async incompleteConnections() {
    const incompleteconnections = await this.incompleteConnection_model
      .find({}, {incompleteDate: 1})
      .populate({
        path: 'userId1',
        select: 'firstName lastName'
      })
      .populate({
        path: 'userId2',
        select: 'firstName lastName'
      })
      .exec();
    return incompleteconnections
  }
}
