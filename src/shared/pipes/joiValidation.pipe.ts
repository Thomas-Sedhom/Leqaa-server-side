import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import Joi from "joi";
export class JoiValidationPipe implements PipeTransform{
  constructor(private schema: Joi.ObjectSchema) {}
  transform(value: any, metadata: ArgumentMetadata): any {
    const { error }: Joi.ValidationResult<any> = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(error.message);
    }
    return value;
  }
}