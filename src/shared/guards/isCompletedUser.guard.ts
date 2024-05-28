import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from "jsonwebtoken";
import { UserService } from "../../user/user.service";

@Injectable()
export class IsCompletedUserGuard implements CanActivate {
  constructor(private jwtService: JwtService, private user_service: UserService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.jwt;
    if (!token)
      throw new UnauthorizedException('Missing JWT token');
    try {
      const decodedToken: any = jwt.verify(token, process.env.TOKEN_KEY);
      const user =await this.user_service.findUserById(decodedToken.id)
      if(user.isCompleted != true)
        return true;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid JWT token');
      } else {
        throw error.message;
      }
    }
  }
}