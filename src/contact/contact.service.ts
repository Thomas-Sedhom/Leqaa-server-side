import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Contact } from "../schemas/Contact.schema";
import mongoose, { Model } from "mongoose";
import { ContactDto } from "./Dtos/contact.dto";

@Injectable()
export class ContactService {
  constructor(@InjectModel(Contact.name) private readonly contact_model: Model<Contact>) {}
  async createMessage(contactDto: ContactDto): Promise<string>{
    await this.contact_model.create(contactDto);
    return "message sent successfully"
  }
  async getMessages(){
    const allMessages = await this.contact_model.find({isDone: false});
    return allMessages
  }
  async messageRead(messageId: mongoose.Types.ObjectId): Promise<string>{
    const readDate: string = new Date().toISOString();
    await this.contact_model.findByIdAndUpdate(messageId, {
      isDone: true,
      readDate: readDate
    })
    return "message read successfully"
  }
  async allReadMessages(){
    const allReadMessages = await this.contact_model.find({isDone: true});
    return allReadMessages
  }
  async deleteMessage(id: mongoose.Types.ObjectId): Promise<string>{
    await this.contact_model.findByIdAndDelete(id);
    return "message deleted successfully";
  }
}
