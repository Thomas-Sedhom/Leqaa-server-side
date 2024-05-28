import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../shared/guards/admin.guard";
import { AdminService } from "./admin.service";
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
  @Get('notApprovedUsers/:id')
  async approvedUser(@Param('id') id :string): Promise<string>{
    try{
      await this.admin_Service.approvedUser(id);
      return "user approved successfully"
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
  @Get('sentRequests')
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
      const connections = await this.admin_Service.getUserById(id);
      return connections
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
}
