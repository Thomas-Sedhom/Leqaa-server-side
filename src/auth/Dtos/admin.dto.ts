import { RoleEnum } from "../../enums/role.enum";
export class AdminDto{
  name: string;
  email: string;
  password: string;
  role: RoleEnum;
}