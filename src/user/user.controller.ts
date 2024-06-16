import { Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { TimelineFilterDto } from "./DTOs/timelineFilter.dto";
import { CustomRequest } from "../shared/interfaces/custom-request.interface";
import { IsWomanGuard } from "../shared/guards/isWoman.guard";
import { IsApprovedUserGuard } from "../shared/guards/isApprovedUser.guard";
@UseGuards(IsApprovedUserGuard)
@Controller('user')
export class UserController {
  constructor(private readonly user_service: UserService) {}
  @Get("timeline")
  async timeline(@Query() timelineDto: TimelineFilterDto, @Req() req: CustomRequest): Promise<any>{
    try{
      console.log(req.user.gender, "name")
      const timeline = await this.user_service.getTimeline(timelineDto, req.user.gender);
      console.log(timeline)
      return timeline
    }catch(error){
      return error.message
    }
  }
  @Get("isCompleted")
  async isCompleted(@Req() req: CustomRequest): Promise<boolean>{
    try{
      const isCompleted: boolean = req.user.isCompleted;
      return isCompleted
    }catch (err){
      return err;
    }
}
  @Get("isApproved")
  async isApproved(@Req() req: CustomRequest): Promise<boolean>{
    try{
      const isApproved: boolean = req.user.isApprove;
      return isApproved
    }catch (err){
      return err;
    }
  }
  @Get("gender")
  async gender(@Req() req: CustomRequest): Promise<string>{
    try{
      const gender: string = req.user.gender;
      return gender
    }catch (err){
      return err;
    }
  }
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
  @Get("timeline/:id")
  async getUser(@Param('id') id: string): Promise<any>{
    try{
      const user = await this.user_service.getUser(id);
      return user
    }catch(error){
      return error.message;
    }
  }
  @Get("timeline/:id/sendRequest")
  async sendRequest(@Param('id') id: string, @Req() req: CustomRequest): Promise<any>{
    try{
      const senderId: string = req.user._id.toString() ;
      await this.user_service.sendRequest(senderId, id);
      return "request sent successfully"
    }catch(error){
      return error.message;
    }
  }
  @Get("sentRequests")
  async getSentRequests(@Req() req: CustomRequest): Promise<any>{
    try{
      console.log(req.user.sentRequests)
      const userId: string = req.user.id;
      const allSentRequests: object[] = await this.user_service.userSentRequests(userId);
      return allSentRequests
    }catch(error){
      return error.message;
    }
  }
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
  @Get("requests/:id")
  async getUserRequest(@Param('id') id: string): Promise<any>{
    try{
      const user = await this.user_service.getUser(id);
      return user
    }catch(error){
      return error.message;
    }
  }
  @Get("requests/:id/accept")
  async acceptRequest(@Param('id') id: string, @Req() req: CustomRequest): Promise<any>{
    try{
      const accepterId: string = req.user._id.toString() ;
      await this.user_service.acceptRequest(id, accepterId);
      return "request accepted successfully"
    }catch(error){
      return error.message;
    }
  }
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
  @Get("findConnection/:id")
  async findConnection(@Param('id') user2: string , @Req() req: CustomRequest): Promise<string>{
    const user1 = req.user._id.toString();
    const check: string = await this.user_service.checkConnection(user1, user2) ;
    return check;
  }
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
  @Get("connections/:id")
  async getConnectionUSer(@Param('id') id: string): Promise<any>{
    try{
      const user = await this.user_service.getUser(id);
      return user
    }catch(error){
      return error.message;
    }
  }
  @Get("profile")
  async getProfile(@Req() req: CustomRequest): Promise<any>{
    try{
      const user = req.user;
      return user
    }catch(error){
      return error.message;
    }
  }
}
