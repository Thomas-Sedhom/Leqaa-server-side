import {Body, Controller, Get, Param, Post, Req, UseGuards} from "@nestjs/common";
import { ContactService } from "./contact.service";
import { ContactDto } from "./Dtos/contact.dto";
import { AuthGuard } from "../shared/guards/auth.guard";
import { CustomRequest } from "../shared/interfaces/custom-request.interface";
import { SuperAdminGuard } from "../shared/guards/super.guard";
import { IsApprovedUserGuard } from "../shared/guards/isApprovedUser.guard";
import mongoose from "mongoose";
@UseGuards(AuthGuard)
@Controller('contact')
export class ContactController {
  constructor(private readonly contact_service: ContactService) {}
  @UseGuards(IsApprovedUserGuard)
  @Post('writeMessage')
  async message(@Body() contactDto: ContactDto, @Req() req: CustomRequest): Promise<string>{
    contactDto.userId = req.user._id;
    contactDto.isDone = false;
    const message: string = await this.contact_service.createMessage(contactDto);
    return message
  }
  @UseGuards(SuperAdminGuard)
  @Get("messages")
  async getAllMessages(){
    const messages = await this.contact_service.getMessages();
    return messages
  }
  @UseGuards(SuperAdminGuard)
  @Get("isDone/:id")
  async messageRead(@Param('id') id: string): Promise <any> {
    try{
      const messageId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id)
      const done: string = await this.contact_service.messageRead(messageId);
      return done;
    }catch(error){
      return error;
    }
  }
  @UseGuards(SuperAdminGuard)
  @Get("allReadMessages")
  async allReadMessages() {
    try{
      const readMessages = await this.contact_service.allReadMessages();
      return readMessages
    }catch(error){
      return error;
    }
  }
  @UseGuards(SuperAdminGuard)
  @Get("/:id")
  async deleteMessage(@Param("id") id: string) {
    try{
      const messageId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(id)
      const messages: string = await this.contact_service.deleteMessage(messageId);
      return messages
    }catch (err){
      return err;
    }
  }
}
