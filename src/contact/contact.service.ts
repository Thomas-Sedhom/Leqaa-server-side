import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Contact } from "../schemas/Contact.schema";
import { Model } from "mongoose";
import { ContactDto } from "./Dtos/contact.dto";

@Injectable()
export class ContactService {
  constructor(@InjectModel(Contact.name) private readonly contact_model: Model<Contact>) {}
  async createMessage(contactDto: ContactDto): Promise<string>{
    await this.contact_model.create(contactDto);
    return "message sent successfully"
  }
  async getMessages(){
    const allMessages = await this.contact_model.find();
    return allMessages
  }
  async deleteMessage(id:  string): Promise<string>{
    await this.contact_model.findByIdAndDelete(id);
    return "message deleted successfully";
  }
}
