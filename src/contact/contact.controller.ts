import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { ContactDto } from "./Dtos/contact.dto";
import { AuthGuard } from "../shared/guards/auth.guard";
import { CustomRequest } from "../shared/interfaces/custom-request.interface";
import { SuperAdminGuard } from "../shared/guards/super.guard";
import { IsApprovedUserGuard } from "../shared/guards/isApprovedUser.guard";
@UseGuards(AuthGuard)
@Controller('contact')
export class ContactController {
  constructor(private readonly contact_service: ContactService) {}
  @UseGuards(IsApprovedUserGuard)
  @Post('writeMessage')
  async message(@Body() contactDto: ContactDto, @Req() req: CustomRequest): Promise<string>{
    contactDto.userId = req.user._id;
    const message: string = await this.contact_service.createMessage(contactDto);
    return message
  }
  @UseGuards(SuperAdminGuard)
  @Get("messages")
  async getAllMessages(){
    const messages = await this.contact_service.getMessages();
    return messages
  }
}
