import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { TimelineFilterDto } from "./DTOs/timelineFilter.dto";
import { CustomRequest } from "../shared/interfaces/custom-request.interface";
import { IsWomanGuard } from "../shared/guards/isWoman.guard";
import { IsApprovedUserGuard } from "../shared/guards/isApprovedUser.guard";
import {AuthGuard} from "../shared/guards/auth.guard";
import mongoose from "mongoose";

@Controller('user')
export class UserController {
  constructor(private readonly user_service: UserService) {}
  @UseGuards(IsApprovedUserGuard)
  @Get("timeline")
  async timeline(@Query() timelineDto: TimelineFilterDto, @Req() req: CustomRequest): Promise<any>{
    try{
      const timeline = await this.user_service.getTimeline(timelineDto, req.user.gender, req.user._id);
      return timeline
    }catch(error){
      return error.message
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Get("isCompleted")
  async isCompleted(@Req() req: CustomRequest): Promise<boolean>{
    try{
      const isCompleted: boolean = req.user.isCompleted;
      return isCompleted
    }catch (err){
      return err;
    }
}
  @UseGuards(IsApprovedUserGuard)
  @Get("isApproved")
  async isApproved(@Req() req: CustomRequest): Promise<boolean>{
    try{
      const isApproved: boolean = req.user.isApprove;
      return isApproved
    }catch (err){
      return err;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Get("gender")
  async gender(@Req() req: CustomRequest): Promise<string>{
    try{
      const gender: string = req.user.gender;
      return gender
    }catch (err){
      return err;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @UseGuards(IsWomanGuard)
  @Get("getProfileStatus")
  async getProfileStatus(@Req() req: CustomRequest): Promise<boolean>{
    try{
      const status: boolean= req.user.isHidden;
      return status;
    }catch(err){
      return err;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @UseGuards(IsWomanGuard)
  @Get("changeProfileStatus")
  async profileStatus(@Req() req: CustomRequest): Promise<boolean>{
    try{
      const userID = req.user._id;
      const status: boolean= req.user.isHidden;
      const res: boolean = await this.user_service.profileStatus(userID, status);
      return res;
    }catch(err){
      return err;
    }
  }
  // @UseGuards(IsWomanGuard)
  // @Get("visibleProfile")
  // async visibleProfile(@Req() req: CustomRequest):Promise<string>{
  //   await this.user_service.visibleProfile(req.user._id);
  //   return "your profile is visible"
  // }
  @UseGuards(IsApprovedUserGuard)
  @Get("timeline/:id")
  async getUser(@Param('id') id: string): Promise<any>{
    try{
      const user = await this.user_service.getUser(id);
      return user
    }catch(error){
      return error.message;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Get("timeline/:id/sendRequest")
  async sendRequest(@Param('id') id: string, @Req() req: CustomRequest): Promise<any>{
    try{
      const senderId: string = req.user._id.toString() ;
      await this.user_service.sendRequest(senderId, id);
      return {message: "request sent successfully" }
    }catch(error){
      return error;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Delete('timeline/:pendingID/removePendingRequest')
  async removeRequest(@Param('pendingID') pendingID: string, @Req() req: CustomRequest ): Promise<any>{
    try{
      const receiverID: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(pendingID);
      const senderID: mongoose.Types.ObjectId = req.user._id;
      const request = await this.user_service.removeRequest(senderID, receiverID);
      return request
    }catch (error){
      return error
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Post('timeline/friendRequestEmail')
  async friendRequestEmail(@Body() email: string, @Req() req: CustomRequest ): Promise<string>{
    try{
      const userName: string = `${req.user.firstName} ${req.user.lastName}`;
      const message: string = await this.user_service.sendFriendRequestEmail(userName, email);
      return message
    }catch (err){
      return err;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Get("sentRequests")
  async getSentRequests(@Req() req: CustomRequest): Promise<any>{
    try{
      const userId: string = req.user.id;
      const allSentRequests: object[] = await this.user_service.userSentRequests(userId);
      return allSentRequests
    }catch(error){
      return error.message;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Get("requests")
  async getRequests(@Req() req: CustomRequest): Promise<object[]>{
    try{
      const userId: string = req.user.id;
      const allRequests: object[] = await this.user_service.userReceivedRequests(userId);
      return allRequests
    }catch(error){
      return error.message;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Get("requests/:id")
  async getUserRequest(@Param('id') id: string): Promise<any>{
    try{
      const user = await this.user_service.getUser(id);
      return user
    }catch(error){
      return error.message;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Get("requests/:id/accept")
  async acceptRequest(@Param('id') id: string, @Req() req: CustomRequest): Promise<any>{
    try{

      const accepterId: string = req.user._id.toString() ;
      console.log(accepterId)
      await this.user_service.acceptRequest(id, accepterId);
      console.log("request accepted successfully");
      return "request accepted successfully"
    }catch(error){
      return error.message;
    }
  }

  @UseGuards(IsApprovedUserGuard)
  @Get("requests/:id/reject")
  async rejectRequest(@Param('id') id: string, @Req() req: CustomRequest): Promise<any>{
    try{
      const accepterId: string = req.user._id.toString() ;
      await this.user_service.rejectRequest(id, accepterId);
      return "request rejected successfully"
    }catch(error){
      return error.message;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Get("findConnection/:id")
  async findConnection(@Param('id') user2: string , @Req() req: CustomRequest): Promise<string>{
    const user1 = req.user._id.toString();
    const check: string = await this.user_service.checkConnection(user1, user2) ;
    return check;
  }
  @UseGuards(IsApprovedUserGuard)
  @Get("connections")
   async getConnections(@Req() req: CustomRequest): Promise<any>{
    try{
      const userId: string = req.user._id.toString();
      const allConnections= await this.user_service.userConnections(userId);
      return allConnections;
    }catch(error){
      return error.message;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Get("confirmConnectionStatus/:userId")
  async confirmConnectionStatus(@Param("userId") userId: string, @Req() req: CustomRequest): Promise<any>{
    const user1Id: mongoose.Types.ObjectId = req.user._id;
    const userId2: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);
    const status = await this.user_service.confirmConnectionStatus(user1Id, userId2);
    return status;
  }
  @UseGuards(IsApprovedUserGuard)
  @Get("rejectedConnections")
  async getRejectedConnections(@Req() req: CustomRequest): Promise<any>{
    try{
      const userId: string = req.user._id.toString();
      const allRejectedConnections= await this.user_service.userRejectedConnections(userId);
      console.log(allRejectedConnections)
      return allRejectedConnections;
    }catch(error){
      return error.message;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Get("connections/:id")
  async getConnectionUSer(@Param('id') id: string): Promise<any>{
    try{
      const user = await this.user_service.getUser(id);
      return user
    }catch(error){
      return error.message;
    }
  }
  @UseGuards(IsApprovedUserGuard)
  @Delete("connections/:id/remove")
  async removeConnection(@Param('id') id: string, @Req() req: CustomRequest): Promise<any>{
    try{
      const userId1: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id);
      const userId2: mongoose.Types.ObjectId = req.user._id
      await this.user_service.removeConnection(userId1, userId2);
      return "connection removed successfully"
    }catch(error){
      return error.message;
    }
  }
  @UseGuards(AuthGuard)
  @Get("profile")
  async getProfile(@Req() req: CustomRequest): Promise<any>{
    try{
      const user = req.user;
      return user
    }catch(error){
      return error;
    }
  }
  @UseGuards(AuthGuard)
  @Get("profile/:userId")
  async getProfileById(@Param("userId") userId: string): Promise<any>{
    try{
      console.log(userId)
      const user = await this.user_service.getAllUserDate(userId);
      console.log(user)
      return user
    }catch(error){
      return error;
    }
  }
  @Get("phone/:phone")
  async getUserByPhone(@Param("phone") phone: string): Promise<any>{
    try{
      console.log(phone)
      const user = await this.user_service.getUserByPhone(phone);
      console.log(user)
      return user
    }catch(error){
      return error;
    }
  }
}

