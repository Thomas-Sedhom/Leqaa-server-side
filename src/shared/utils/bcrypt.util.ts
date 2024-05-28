import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from "@nestjs/common";
const saltNumber: number = 10;
export const hashPass = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltNumber);
  const hashPassword: string = await bcrypt.hash(password, salt);
  return hashPassword
}

export const comparePass = async (password: string, hashPassword: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashPassword);
  // if (!isMatch) {
  //   throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
  // }
  return isMatch; // Explicitly return true/false based on comparison
};