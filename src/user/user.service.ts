import { BadRequestException, Injectable } from "@nestjs/common";
import { TimelineFilterDto } from "./DTOs/timelineFilter.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schemas/User.schema";
import mongoose, { Model } from "mongoose";
import { GenderEnum } from "../enums/gender.enum";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user_model: Model<User> ) {
  }
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
    console.log(query)
    const users = await this.user_model.find(query, 'firstName faceImage lastName');
    return users;
  }
  async findUserById(id: string){
    const updatedId = new mongoose.Types.ObjectId(id)
    const user = await this.user_model.findById(updatedId)
    return user
  }
  async hiddenProfile(id: string){
    await this.user_model.findByIdAndUpdate(id, {
      isHidden: true
    })
  }
  async visibleProfile(id: string){
    await this.user_model.findByIdAndUpdate(id, {
      isHidden: false
    })
  }
  async getUsers(requests: string[]): Promise<object[]>{
    const allUsers = []

    for (const id of requests) {
      const user = await this.findUserById(id);
      allUsers.push({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        faceImage: user.faceImage
      })
    }
    return allUsers
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
  async sendRequest(senderId: string, receivedId: string): Promise<string>{
    const received = await this.findUserById(receivedId)
    const sender = await this.findUserById(senderId)
    sender.receivedRequests.forEach(id => {
      if(id == receivedId)
        throw new BadRequestException("this user sent to you connection request ")
    })
    sender.sentRequests.forEach(id => {
      if(id == receivedId)
        throw new BadRequestException("you sent request before ")
    })
    sender.connections.forEach(id => {
      if(id == receivedId)
        throw new BadRequestException("in your connections ")
    })

    received.receivedRequests.push(senderId);
    sender.sentRequests.push(receivedId);

    await sender.save();
    await received.save();

    return "request sent successfully"
  }
  async acceptRequest(senderId: string, accepterId: string): Promise<string> {
    // Find the user document for the accepter
    const accepterDoc = await this.user_model.findById(accepterId);

    // Check if the sender's ID is in the accepter's received requests
    if (!accepterDoc.receivedRequests.includes(senderId)) {
      throw new BadRequestException("forbidden");
    }

    // Update the accepter's received requests
    accepterDoc.receivedRequests = accepterDoc.receivedRequests.filter((id) => id !== senderId);
    accepterDoc.connections.push(senderId);
    await accepterDoc.save();

    // Update the sender's sent requests and connections
    const senderDoc = await this.user_model.findById(senderId);
    senderDoc.sentRequests = senderDoc.sentRequests.filter((id) => id !== accepterId);
    senderDoc.connections.push(accepterId);
    await senderDoc.save();

    return "accept connection successfully";
  }
}
