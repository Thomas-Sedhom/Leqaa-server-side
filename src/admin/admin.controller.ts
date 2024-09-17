import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../shared/guards/admin.guard";
import { AdminService } from "./admin.service";
import {CustomRequest} from "../shared/interfaces/custom-request.interface";
import mongoose from "mongoose";
import { RemovePendingRequestDto } from "./DTOs/removePendingRequest";
import { WarningEmailDTO } from "./DTOs/warningEmail.DTO";
import { SuperAdminGuard } from "../shared/guards/super.guard";
import { AuthGuard } from "../shared/guards/auth.guard";
import { PaginationDTO } from "../shared/DTOs/pagination.dto";
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin_Service: AdminService) {}
  @Get('notApprovedUsers')
  async notApprovedUsers(): Promise<any>{
    try{
      const users = await this.admin_Service.getNotApprovedUsers()
      return users
    }catch (error){
      return error.message
    }
  }
  @Get('notApprovedUsers/:id/accept')
  async approvedUser(@Param('id') id :string): Promise<string>{
    try{
      await this.admin_Service.approvedUser(id);
      return "user approved successfully"
    }catch (error){
      return error
    }
  }
  @Get('notApprovedUsers/:id/reject')
  async rejectUser(@Param('id') id :string): Promise<string>{
    try{
      const rejectedUser: string = await this.admin_Service.deleteUserById(id);
      return rejectedUser
    }catch (error){
      return error
    }
  }
  @Post('notApprovedUsers/:id/warning')
  async warning(@Param('id') id :string, @Body() warning: string): Promise<string>{
    try{
      const warnedUser: string = await this.admin_Service.warningUser(id, warning);
      return warnedUser
    }catch (error){
      return error
    }
  }
  @Post('warningEmail')
  async warningEmail(@Body() warningEmail: WarningEmailDTO){
    try{
      const warningEmailMessage = await this.admin_Service.warningEmail(warningEmail);
      return warningEmailMessage
    }catch (error){
      return error
    }
  }
  @Get('connections')
  async connections(): Promise<any>{
    try{
      const connections = await this.admin_Service.getUsersConnections();
      return connections
    }catch (error){
      return error
    }
  }
  @Get('rejectedConnections')
  async rejectedConnections(): Promise<any>{
    try{
      const rejectedConnections = await this.admin_Service.getUsersRejectedConnections();
      return rejectedConnections
    }catch (error){
      return error
    }
  }
  @Post('incompleteConnection/:connectionId')
  async incompleteConnection(@Param('connectionId') connectionId: string): Promise<any>{
    try{
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(connectionId);
      const incompleteConnection = await this.admin_Service.incompleteConnection(id);
      return incompleteConnection
    }catch (error){
      return error
    }
  }
  @Get('incompleteConnections')
  async incompleteConnections(): Promise<any>{
    try{
      const incompleteConnections = await this.admin_Service.incompleteConnections();
      return incompleteConnections
    }catch (error){
      return error
    }
  }
  @Get('pendingRequests')
  async requests(): Promise<any>{
    try{
      const connections = await this.admin_Service.getUsersSentRequests();
      return connections
    }catch (error){
      return error
    }
  }
  @Get('removePendingRequest/:pendingId')
  async removeRequest(@Param('pendingId') pendingId: string ): Promise<any>{
    try{
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(pendingId)
      const request = await this.admin_Service.removeRequest(id);
      return request
    }catch (error){
      return error
    }
  }
  @Get('acceptPendingRequest/:sender/:receiver')
  async acceptRequest(
    @Param('sender') sender: string,
    @Param('receiver') receiver: string
  ): Promise<any>{
    try{
      const userId1: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(sender)
      const userId2: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(receiver)
      const request = await this.admin_Service.acceptRequest(userId1, userId2);
      return request
    }catch (error){
      return error
    }
  }
  @Get('connections/:id')
  async getConnectionUser(@Param('id') id: string):Promise<any>{
    try{
      const user = await this.admin_Service.getUserById(id);
      return user
    }catch (error){
      return error
    }
  }
  @Get('sentRequests/:id')
  async getRequestUser(@Param('id') id: string): Promise<any>{
    try{
      const connections = await this.admin_Service.getUserById(id);
      return connections
    }catch (error){
      return error
    }
  }
  @Get('usersWarning')
  async getWarningUsers(): Promise<any>{
    try{
      const users = await this.admin_Service.getWarningUsers();
      return users
    }catch (error){
      return error
    }
  }
  @Get('block/:userId')
  async block(@Param('userId') userId: string): Promise<any>{
    try{
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);
      const block: string = await this.admin_Service.block(id);
      return block;
    }catch (error){
      return error;
    }
  }
  @Get('unBlock/:userId')
  async unBlock(@Param('userId') userId: string): Promise<any>{
    try{
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(userId);
      const unBlock: string = await this.admin_Service.unBlock(id);
      return unBlock;
    }catch (error){
      return error;
    }
  }
  @Get("profile")
  async getProfile(@Req() req: CustomRequest): Promise<any>{
    try{
      const admin = req.admin;
      return admin
    }catch(error){
      return error.message;
    }
  }
  @Get("incompleteUsers")
  async incompleteUsers(@Query() pagination: PaginationDTO): Promise<any>{
    try{
      const incompleteUsers = await this.admin_Service.incompleteUsers(pagination);
      return incompleteUsers;
    }catch (err){
      return err;
    }
  }
  @Get("incompleteUsersCount")
  async incompleteUsersCount(): Promise<any>{
    try{
      const incompleteUsersCount = await this.admin_Service.incompleteUsersCount();
      return incompleteUsersCount;
    }catch (err){
      return err;
    }
  }
  @Get("allUsers")
  async getAllUsers(): Promise<any>{
    const allUsers = await this.admin_Service.getAllUsers();
    return allUsers;
  }

  @Get("allAdmins")
  @UseGuards(SuperAdminGuard)
  async getAdmins(@Req() req: CustomRequest): Promise<any>{
    try{
      const currentUserId: mongoose.Types.ObjectId =  req.admin.id;
      const allAdmins = await this.admin_Service.getAllAdmins(currentUserId);
      return allAdmins;
    }catch (error){
      return error;
    }
  }
  @Delete("deleteAdmin/:adminId")
  @UseGuards(SuperAdminGuard)
  async deleteAdmin(@Param("adminId") adminId : string): Promise<any>{
    try{
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(adminId);
      const deletedAdmin = await this.admin_Service.deleteAdmin(id);
      return deletedAdmin;
    }catch (error){
      return error;
    }
  }

  @Post("connections/:connectionId/confirm")
  async commission(
    @Body("commission") commission: string,
    @Param('connectionId') connectionId: string
  ): Promise<any>{
    try{
      const id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(connectionId);
      await this.admin_Service.commission(id, commission);
      return {message:"commission entered successfully."};
    }catch (error){
      return error;
    }
  }
}

