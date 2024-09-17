import { BadRequestException, Injectable } from "@nestjs/common";
import { TimelineFilterDto } from "./DTOs/timelineFilter.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schemas/User.schema";
import mongoose, {Model, PipelineStage} from "mongoose";
import { GenderEnum } from "../enums/gender.enum";
import { Connection } from "../schemas/Connection.schema";
import { PendingConnection } from "../schemas/PendingConnection.schema";
import {MailerService} from "@nestjs-modules/mailer";
import { RejectedConnection } from "../schemas/rejectedConnection.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private user_model: Model<User>,
    @InjectModel(Connection.name) private connection_model: Model<Connection>,
    @InjectModel(PendingConnection.name) private pendingConnection_model: Model<PendingConnection>,
    @InjectModel(RejectedConnection.name) private rejectConnection_model: Model<RejectedConnection>,
    private readonly mailer_service: MailerService,
  ) {}
  private async getConnectionUserIds(userId: mongoose.Types.ObjectId) {
    const connections = await this.connection_model.find({
      $or: [{ userId1: userId }, { userId2: userId }],
    });
    return connections.map((connection) => {
      let connectionData  = {}
      const id1: string =  connection.userId1.toString();
      const id2: string =  userId.toString();
      if( id1 === id2)
        connectionData = connection.userId2
      else
        connectionData = connection.userId1
      return connectionData
    });
  }
  private async getRejectedConnectionUserIds(userId: mongoose.Types.ObjectId) {
    const rejectedConnections = await this.rejectConnection_model.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });
    return rejectedConnections.map((connection) => {
      let connectionData  = {}
      const id1: string =  connection.sender.toString();
      const id2: string =  userId.toString();
      if( id1 === id2)
        connectionData = connection.receiver
      else
        connectionData = connection.sender
      return connectionData
    });
  }
  private async getPendingConnectionUserIds(userId: mongoose.Types.ObjectId) {
    const connections = await this.pendingConnection_model.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });
    return connections.map((connection) => {
      let connectionData  = {}
      const id1: string =  connection.sender.toString();
      const id2: string =  userId.toString();
      if( id1 === id2)
        connectionData = connection.receiver
      else
        connectionData = connection.sender
      return connectionData
    });
  }
  private async getPendingSenderConnectionUsers(userId: mongoose.Types.ObjectId) {
    const aggregation: PipelineStage[] = [
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $lookup: {
          from: 'users', // Replace with your user collection name
          localField: 'sender', // Assuming sender or receiver field stores user ID (replace accordingly)
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user', // Unwind the user array to access individual user documents
      },
      {
        $project: {
          _id: 1, // Include these fields in the final result
          requestDate: 1,
          user: {
            _id: 1, // Include these fields for the user object
            fullImage1: 1,
            age: 1,
            governorate: 1,
            jobTitle: 1,
            businessType: 1
          },
        },
      },
      {
        $match:{
          'user._id': {$ne: userId}
        }
      },
    ];
    const pendingConnections = await this.pendingConnection_model.aggregate(aggregation);
    return pendingConnections;
  }
  private async getPendingReceiverConnectionUsers(userId: mongoose.Types.ObjectId) {
    const aggregation: PipelineStage[] = [
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $lookup: {
          from: 'users', // Replace with your user collection name
          localField: 'receiver', // Assuming sender or receiver field stores user ID (replace accordingly)
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user', // Unwind the user array to access individual user documents
      },
      {
        $project: {
          _id: 1, // Include these fields in the final result
          requestDate: 1,
          user: {
            _id: 1, // Include these fields for the user object
            fullImage1: 1,
            age: 1,
            governorate: 1,
            jobTitle: 1,
            businessType: 1
          },
        },
      },
      {
        $match:{
          'user._id': {$ne: userId}
        }
      },
    ];

    const pendingConnections = await this.pendingConnection_model.aggregate(aggregation);

    return pendingConnections;
  }
  async getTimeline(filterDto: TimelineFilterDto, gender: GenderEnum, userId: mongoose.Types.ObjectId) {
    const str1: any = filterDto.governorate
    const govs = str1.split(",");
    const str2: any = filterDto.schoolType
    const schos = str2.split(",");
    const query: any = {
      firstName: { $ne: null },
      lastName: { $ne: null },
      faceImage: { $ne: null },
      isHidden: false,
      isApprove: true
    };
    const otherQuery: any = {}
    if(gender == GenderEnum.انثى){
      query.gender = GenderEnum.ذكر;
    } else{
      query.gender = GenderEnum.انثى
    }
    if(filterDto){
      if (govs[0] !== '') {
        query.governorate = { $in: govs } ;
        otherQuery['user.governorate'] = { $in: govs }
      }
      if (filterDto.minAge && filterDto.maxAge) {
        query.age = { $gte: parseInt(filterDto.minAge), $lte: parseInt(filterDto.maxAge) };
        otherQuery['user.age'] = { $gte: parseInt(filterDto.minAge), $lte: parseInt(filterDto.maxAge) };
      }
      if (filterDto.apartment !== undefined && filterDto.apartment !== "") {
        query.apartment = filterDto.apartment==="true";
        otherQuery['user.apartment'] = {$ne: filterDto.apartment !== "true"};
      }
      if (filterDto.car !== undefined && filterDto.car !== "") {
        query.car = filterDto.car==="true";
        otherQuery['user.car'] = {$ne: filterDto.car !== "true"};
      }
      if (filterDto.job !== undefined && filterDto.job !== "") {
        query.job = filterDto.job==="true";
        otherQuery['user.job'] = {$ne: filterDto.job !== "true"};
      }
      if (filterDto.businessOwner !== undefined && filterDto.businessOwner !== "") {
        query.businessOwner = filterDto.businessOwner==="true";
        otherQuery['user.businessOwner'] = {$ne: filterDto.businessOwner !== "true"};
      }
      if (filterDto.marriedBefore !== undefined && filterDto.marriedBefore !== "") {
        query.marriedBefore = filterDto.marriedBefore==="true";
        otherQuery['user.marriedBefore'] = {$ne: filterDto.marriedBefore !== "true"};
      }
      if (filterDto.children !== undefined && filterDto.children !== "") {
        query.children = filterDto.children==="true";
        otherQuery['user.children'] = {$ne: filterDto.children !== "true"};
      }
      if (schos[0] !== '') {
        query.schoolType = { $in: schos }  ;
        otherQuery['user.schoolType'] = { $in: schos }  ;
      }
      if (filterDto.religion !== undefined && filterDto.religion != "") {
        query.religion = filterDto.religion;
        otherQuery['user.religion'] = filterDto.religion;
      }
      // if (filterDto.habits != "") {
      //   query.habits = { $in: filterDto.habits.split(',') };
      // }
      if (filterDto.livingAbroad !== undefined && filterDto.livingAbroad !== "") {
        query.livingAbroad = filterDto.livingAbroad === "true";
        otherQuery['user.livingAbroad'] = filterDto.livingAbroad;
      }
    }
    // get user Connections
    const connections = await this.getConnectionUserIds(userId);
    const rejectedConnections = await this.getRejectedConnectionUserIds(userId);
    const pending = await this.getPendingConnectionUserIds(userId)
    query._id = {$nin: [...connections, ...rejectedConnections, ...pending]}
    const users = await this.user_model.find(query, 'fullImage1 age governorate jobTitle businessType');
    const pendingSenderConnections = await this.getPendingSenderConnectionUsers(userId)
    const pendingReciverConnections = await this.getPendingReceiverConnectionUsers(userId)
    const timelineUsers = [];
    timelineUsers.push(...users.map((user) => ({
      ...user.toObject(),
    })));
    return {pendingSenderConnections, pendingReciverConnections, timelineUsers};
  }
  async findUserById(id: string){
    const updatedId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id)
    const user = await this.user_model.findById(updatedId)
    return user
  }
  async deleteUserById(id: string){
    const deletedUser = await this.user_model.findByIdAndDelete(id);
    return deletedUser
  }
  async profileStatus(id: string, status: boolean): Promise<boolean>{
    if(status == false){
      await this.user_model.findByIdAndUpdate(id, {
        isHidden: true
      })
      return true;
    } else{
      await this.user_model.findByIdAndUpdate(id, {
        isHidden: false
      })
      return false
    }
  }
  async userSentRequests(userId: string){
    const userObjectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);
    const pendingConnections = await this.pendingConnection_model.find(
      { sender: userObjectId },
      {receiver: 1, _id: 0}
    ).populate({
      path: 'receiver',
      select: '_id firstName lastName age faceImage',
    })
    return pendingConnections
  }
  async userReceivedRequests(userId: string){
    const userObjectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);
    const pendingConnections = await this.pendingConnection_model.find(
      { receiver: userObjectId },
      {sender: 1, _id: 0}
    ).populate({
      path: 'sender',
      select: '_id firstName lastName age faceImage',
    })
    return pendingConnections
  }
  async checkConnection(user1: string, user2: string): Promise<string>{
    const userObjectId1: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(user1);
    const userObjectId2: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(user2);
    const checkConnection = await this.connection_model.findOne({
      $or: [{ userId1: userObjectId1, userId2: userObjectId2 }, { userId1: userObjectId2, userId2: userObjectId1 }],
    })
    const checkPendingConnection = await this.pendingConnection_model.findOne({
      $or: [{ sender: userObjectId1, receiver: userObjectId2 }, { sender: userObjectId2, receiver: userObjectId1 }],
    })
    if (checkConnection)
      return "connected"
    else if(checkPendingConnection)
      return "pending";
    else
      return "not_connected"
  }
  async userConnections(userId: string) {
    const userObjectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);

    const connections = await this.connection_model.find({
      $or: [{ userId1: userObjectId }, { userId2: userObjectId }],
    })
      .populate({
        path: 'userId1',
        select: '_id firstName lastName faceImage age',
        match: {_id: {$ne: userObjectId}}
      })
      .populate({
        path: 'userId2',
        select: '_id firstName lastName faceImage age',
        match: {_id: {$ne: userObjectId}}
      })
      .exec();
    const connectionResponses = connections.map((connection) => {
      let connectionData  = {}
      if(connection.userId1)
        connectionData = connection.userId1
      else
        connectionData = connection.userId2
      return connectionData
    });
    return connectionResponses;
  }
  async userRejectedConnections(userId: string) {
    const userObjectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);
    const rejectedConnections = await this.rejectConnection_model.find({
      $or: [{ sender: userObjectId }, { receiver: userObjectId }],
    },{ requestDate: 1, rejectDate: 1 })
      .populate({
        path: 'sender',
        select: '_id firstName lastName',
        match: {_id: {$ne: userObjectId}}
      })
      .populate({
        path: 'receiver',
        select: '_id firstName lastName',
        match: {_id: {$ne: userObjectId}}
      })
      .exec();
    const connectionResponses = rejectedConnections.map((connection) => {
      let connectionData: any  = {}
      if(connection.sender)
        connectionData.user = connection.sender
      else
        connectionData.user = connection.receiver
      connectionData.requestDate = connection.requestDate
      connectionData.rejectDate = connection.rejectDate
      return connectionData
    });
    return connectionResponses;
  }
  async getAllUserDate(id: string){
    const user = await this.user_model.findById(id, {password: 0});
    return user
  }
  async getUser(id: string): Promise<any>{
    const user = await this.user_model.findById(id, {password: 0, idImage: 0});
    return user
  }
  async sendRequest(senderId: string, receiverId: string): Promise<string>{
    const senderIdObject: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(senderId)
    const receiverIdObject: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(receiverId)
    const checkConnection = await this.connection_model.findOne(
      { $or: [ {userId1: senderIdObject,  userId2: receiverIdObject}, {userId1: receiverIdObject,  userId2: senderIdObject}] },
    { lean: true }
    )
    const checkUserConnections = await this.pendingConnection_model.findOne(
      {sender: senderIdObject})
    if(checkConnection != null)
      throw new BadRequestException("in your connections")
    if(checkUserConnections != null)
      throw new BadRequestException("لقد أرسلت طلب تعارف لأحد الأشخاص من قبل. قم بإلغائه لتتمكن من إرسال طلب جديد.")

    const checkPendingConnection = await this.pendingConnection_model.findOne(
      {
        $or: [{sender: senderIdObject, receiver: receiverIdObject}, {sender: receiverIdObject,receiver: senderIdObject}]
      }, { lean: true }
    )
    if(checkPendingConnection != null)
      throw new BadRequestException("request pending already")

    const currentDate: Date = new Date();
    const formattedPendingConnectionDate: string = currentDate.toISOString().slice(0, 10);
    await this.pendingConnection_model.create({
      sender: senderIdObject,
      receiver: receiverIdObject,
      requestDate: formattedPendingConnectionDate
    })
    return "request sent successfully"
  }
  async sendFriendRequestEmail(userName: string, email: any): Promise<string>{
    console.log("email")
    console.log(userName,email )
    await this.mailer_service.sendMail({
      to: email.email,
      subject: 'طلب مقابلة',
      html: `
 لقد ابدي     
       <span style="color: red; font-weight: bold;">${userName}</span>
   رغبه في التواصل الاسري مع حضرتك ، يرجي مراجعة الطلب و ابداء الرأي بالموافقة أو الرفض.    `
    })
    console.log(email)
    return "email sent successfully"
  }
  async acceptRequest(senderId: string, receiverId: string): Promise<string> {
    const sender1IdMongooseObject: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(senderId)
    const sender2IdMongooseObject: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(receiverId)
    const pendingConnection: mongoose.mongo.DeleteResult = await this.pendingConnection_model.deleteOne(
      {
        sender: sender1IdMongooseObject,
        receiver: sender2IdMongooseObject
      }
    )
    if(pendingConnection.deletedCount == 1){
      const currentDate: Date = new Date();
      const formattedConnectionDate: string = currentDate.toISOString().slice(0, 10);
      const connection = await this.connection_model.create({
        userId1: sender1IdMongooseObject,
        userId2: sender2IdMongooseObject,
        connectionDate: formattedConnectionDate,
        commission: undefined
      })
      await connection.save();
      console.log(connection)
    }else{
      throw new BadRequestException("send connection request first")
    }
    return "accepted connection successfully";
  }
  async rejectRequest(senderId: string, receiverId: string): Promise<string> {

    const senderIdMongooseObject: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(senderId)
    const receiverIdMongooseObject: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(receiverId)
    const pendingConnection = await this.pendingConnection_model.findOneAndDelete(
      {sender: senderIdMongooseObject, receiver: receiverIdMongooseObject}
    )

    if(pendingConnection){
      const rejectedDate = new Date().toISOString().slice(0, 10);
      const rejectedConnections = await this.rejectConnection_model.create({
        sender: senderIdMongooseObject,
        receiver: receiverIdMongooseObject,
        requestDate: pendingConnection.requestDate,
        rejectDate: rejectedDate
      })
      await rejectedConnections.save()
      console.log(rejectedConnections)
      return "rejected connection successfully";
    }
    else
      throw new BadRequestException("send connection request first")
  }
  async getAllUsers(){
    const allUsers = await this.user_model.find({isCompleted: true}, {password: 0});
    return allUsers
  }

  async removeConnection(userId1: mongoose.Types.ObjectId, userId2: mongoose.Types.ObjectId) {
    await this.connection_model.findOneAndDelete(
      {$or: [{ userId1, userId2  }, { userId1: userId2, userId2: userId1}]}
    )
    return "connection successfully removed"
  }

  async confirmConnectionStatus(userId1: mongoose.Types.ObjectId, userId2: mongoose.Types.ObjectId): Promise <boolean> {
    const connection = await this.connection_model.findOne(
      {$or: [{ userId1: userId2, userId2: userId1 }, { userId1, userId2}]},
    )
    console.log(connection)
    const commission = connection.commission
    console.log(commission)
    return !(commission == undefined || !commission);
  }

  async removeRequest(senderID: mongoose.Types.ObjectId, receiverID: mongoose.Types.ObjectId) {
    const removeRequest = await this.pendingConnection_model.findOneAndDelete(
      {sender: senderID, receiver: receiverID}
    )
    return removeRequest
  }

  async getUserByPhone(phone: string) {
    const user = await this.user_model.findOne({phone})
    return user
  }
}