import { RoleEnum } from "../../enums/role.enum";
export class AdminDto{
  email: string;
  password: string;
  role: RoleEnum;
}