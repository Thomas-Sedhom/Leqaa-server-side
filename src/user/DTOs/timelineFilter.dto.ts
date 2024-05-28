import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
export class TimelineFilterDto {
  @IsOptional()
  @IsString()
  governorate?: string;

  @IsOptional()
  minAge?: string;

  @IsOptional()
  maxAge?: string;

  @IsOptional()
  apartment?: string;

  @IsOptional()
  car?: string;

  @IsOptional()
  job?: string;

  @IsOptional()
  businessOwner?: string;

  @IsOptional()
  marriedBefore?: string;

  @IsOptional()
  children?: string;

  @IsOptional()
  @IsString()
  schoolType?: string;

  @IsOptional()
  @IsString()
  religion?: string;

  @IsOptional()
  @IsString()
  habits?: string;

  @IsOptional()
  @IsBoolean()
  livingAbroad?: string;
}