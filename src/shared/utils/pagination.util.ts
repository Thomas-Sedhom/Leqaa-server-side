import { PaginationDTO } from "../DTOs/pagination.dto";
import { Model } from "mongoose";

export const PaginationUtil= async <T> (paginationQuery: PaginationDTO, Model: Model<T>, filter?: any) => {
  const limit = Number(paginationQuery.limit) || null;
  const page = Number(paginationQuery.page) || 1;
  const skip = (page - 1) * limit;
  return Model.find(filter , null, { limit, skip }).sort({ ['registrationDate']: -1 });
}