import { BadRequestException, Injectable } from "@nestjs/common";
import { TimelineFilterDto } from "./DTOs/timelineFilter.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schemas/User.schema";
import mongoose, { Model } from "mongoose";
import { GenderEnum } from "../enums/gender.enum";
import { Connection } from "../schemas/Connection.schema";
import { PendingConnection } from "../schemas/PendingConnection.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private user_model: Model<User>,
    @InjectModel(Connection.name) private connection_model: Model<Connection>,
    @InjectModel(PendingConnection.name) private pendingConnection_model: Model<PendingConnection>
  ) {}
  async getTimeline(filterDto: TimelineFilterDto, gender: GenderEnum) {
    const query: any = {
      firstName: { $ne: null },
      lastName: { $ne: null },
      faceImage: { $ne: null },
      isHidden: false,
      isApprove: true
    };
    if(gender == GenderEnum.انثى){
      query.gender = GenderEnum.ذكر;
      console.log(gender, query.gender, 1)
    } else{
      query.gender = GenderEnum.انثى
      console.log(gender, query.gender, 2)
    }
    if (filterDto.governorate) {
      query.governorate = filterDto.governorate;
    }
    if (filterDto.minAge && filterDto.maxAge) {
      query.age = { $gte: parseInt(filterDto.minAge), $lte: parseInt(filterDto.maxAge) };
    }
    if (filterDto.apartment !== undefined) {
      query.apartment = filterDto.apartment==="true";
    }
    if (filterDto.car !== undefined) {
      query.car = filterDto.car==="true";
    }
    if (filterDto.job !== undefined) {
      query.job = filterDto.job==="true";
    }
    if (filterDto.businessOwner !== undefined) {
      query.businessOwner = filterDto.businessOwner==="true";
    }
    if (filterDto.marriedBefore !== undefined) {
      query.marriedBefore = filterDto.marriedBefore==="true";
    }
    if (filterDto.children !== undefined) {
      query.children = filterDto.children==="true";
    }
    if (filterDto.schoolType) {
      query.schoolType = filterDto.schoolType;
    }
    if (filterDto.religion) {
      query.religion = filterDto.religion;
    }
    if (filterDto.habits) {
      query.habits = { $in: filterDto.habits.split(',') };
    }
    if (filterDto.livingAbroad !== undefined) {
      query.livingAbroad = filterDto.livingAbroad==="true";
    }
    const users = await this.user_model.find(query, 'firstName faceImage lastName');
    return users;
  }
  async findUserById(id: string){
    const updatedId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id)
    const user = await this.user_model.findById(updatedId)
    return user
  }
  async hiddenProfile(id: string): Promise<void>{
    await this.user_model.findByIdAndUpdate(id, {
      isHidden: true
    })
  }
  async visibleProfile(id: string): Promise<void>{
    await this.user_model.findByIdAndUpdate(id, {
      isHidden: false
    })
  }
  async userSentRequests(userId: string){
    const userObjectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);
    const pendingConnections = await this.pendingConnection_model.find(
      { sender: userObjectId },
      {receiver: 1, _id: 0}
    ).populate({
      path: 'receiver',
      select: '_id fullImage firstName lastName',
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
      select: '_id fullImage firstName lastName',
    })
    return pendingConnections
  }
  async userConnections(userId: string) {
    const userObjectId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);

    const connections = await this.connection_model.find({
      $or: [{ userId1: userObjectId }, { userId2: userObjectId }],
    })
      .populate({
        path: 'userId1',
        select: '_id fullImage firstName',
        match: {_id: {$ne: userObjectId}}
      })
      .populate({
        path: 'userId2',
        select: '_id fullImage firstName',
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
    console.log(connections)
    return connectionResponses;
  }
  async getUser(id: string): Promise<any>{
    const userData: any = {};
    const user = await this.user_model.findById(id);
    userData.fullImage = user.fullImage;
    userData.nationality = user.nationality;
    userData.address = user.address;
    userData.religion = user.religion;
    userData.qualification = user.qualification;
    userData.college = user.college;
    userData.schoolType = user.schoolType;
    userData.age = user.age;
    userData.height = user.height;
    userData.weight = user.weight;
    userData.job = user.jobTitle;
    userData.apartment = user.apartment;
    userData.car = user.car;
    userData.habbits = user.habits;
    userData.otherInfo = user.otherInfo;
    return userData
  }
  async sendRequest(senderId: string, receiverId: string): Promise<string>{
    const senderIdObject: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(senderId)
    const receiverIdObject: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(receiverId)
    const checkConnection = await this.connection_model.findOne(
      { $or: [ {userId1: senderIdObject,  userId2: receiverIdObject}, {userId1: receiverIdObject,  userId2: senderIdObject}] },
    { lean: true }
    )
    if(checkConnection != null)
      throw new BadRequestException("in your connections")

    const checkPendingConnection = await this.pendingConnection_model.findOne(
      {
        $or: [{sender: senderIdObject, receiver: receiverIdObject}, {sender: receiverIdObject,receiver: senderIdObject}]
      }, { lean: true }
    )
    if(checkPendingConnection != null)
      throw new BadRequestException("request pending already")

    await this.pendingConnection_model.create({
      sender: senderIdObject,
      receiver: receiverIdObject
    })
    return "request sent successfully"
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
      await this.connection_model.create({
        userId1: sender1IdMongooseObject,
        userId2: sender2IdMongooseObject
      })
    }else{
      throw new BadRequestException("send connection request first")
    }
    return "accepted connection successfully";
  }
  async rejectRequest(senderId: string, receiverId: string): Promise<string> {
    const senderIdMongooseObject: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(senderId)
    const receiverIdMongooseObject: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(receiverId)
    const pendingConnection: mongoose.mongo.DeleteResult = await this.pendingConnection_model.deleteOne(
      {sender: senderIdMongooseObject, receiver: receiverIdMongooseObject}
    )
    if(pendingConnection.deletedCount == 1){
      return "rejected connection successfully";
    }else{
      throw new BadRequestException("send connection request first")
    }
  }
}
