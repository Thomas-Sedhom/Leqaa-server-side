import { IsNotEmpty, IsString } from "class-validator";

export class RemovePendingRequestDto {
  @IsNotEmpty()
  @IsString()
  sender: string
  @IsNotEmpty()
  @IsString()
  receiver: string
}