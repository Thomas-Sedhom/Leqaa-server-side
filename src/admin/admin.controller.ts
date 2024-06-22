import {Body, Controller, Get, Param, Post, Req, UseGuards} from "@nestjs/common";
import { AdminGuard } from "../shared/guards/admin.guard";
import { AdminService } from "./admin.service";
import {CustomRequest} from "../shared/interfaces/custom-request.interface";
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
  @Get('connections')
  async connections(): Promise<any>{
    try{
      const connections = await this.admin_Service.getUsersConnections();
      return connections
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
  @Get('connections/:id')
  async getConnectionUser(@Param('id') id: string):Promise<any>{
    try{
      console.log(id)
      const user = await this.admin_Service.getUserById(id);
      console.log(user)
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
  @Get("profile")
  async getProfile(@Req() req: CustomRequest): Promise<any>{
    try{
      console.log(req.admin)
      const admin = req.admin;
      return admin
    }catch(error){
      return error.message;
    }
  }
  @Get("allUsers")
  async getAllUsers(): Promise<any>{
    const allUsers = await this.admin_Service.getAllUsers();
    return allUsers;
  }
}
