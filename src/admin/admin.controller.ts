import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../shared/guards/admin.guard";
import { AdminService } from "./admin.service";
import { User } from "../schemas/User.schema";
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin_Service: AdminService) {}
  @Get('notApprovedUsers')
  async notApprovedUsers(){
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
  async connections(): Promise<User[]>{
    try{
      const connections: User[] = await this.admin_Service.getUsersConnections();
      return connections
    }catch (error){
      return error
    }
  }
  @Get('sentRequests')
  async requests(): Promise<User[]>{
    try{
      const connections: User[] = await this.admin_Service.getUsersSentRequests();
      return connections
    }catch (error){
      return error
    }
  }
}
