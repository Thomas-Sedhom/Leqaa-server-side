import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import * as jwt from "jsonwebtoken";
import { UserService } from "../../user/user.service";
import { AdminService } from "../../admin/admin.service";

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private jwtService: JwtService, private admin_service: AdminService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.jwt;
    if (!token)
      throw new UnauthorizedException('Missing JWT token');
    try {
      const decodedToken: any = jwt.verify(token, process.env.TOKEN_KEY);
      const admin = await this.admin_service.findAdminById(decodedToken.id)
      if(!admin)
        throw new UnauthorizedException("unauthorized user")
      if(admin.role == 'super')
        return true;
      else
        throw new BadRequestException("you are not super admin")
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid JWT token');
      } else {
        throw error;
      }
    }
  }
}