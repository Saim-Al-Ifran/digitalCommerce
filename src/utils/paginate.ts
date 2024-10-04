import { Model, Document } from 'mongoose';

interface PaginationResult<T> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
  page: number;
}

const paginate = async <T extends Document>(
  model: Model<T>,
  query: object,
  page: number,
  limit: number,
  sort: any = {}
): Promise<PaginationResult<T>> => {
  const skip = (page - 1) * limit;
  const data = await model.find(query).skip(skip).limit(limit).sort(sort).exec();
  const totalRecords = await model.countDocuments(query).exec();
  const totalPages = Math.ceil(totalRecords / limit);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return {
    data,
    totalRecords,
    totalPages,
    prevPage,
    nextPage,
    page,
  };
};

export default paginate;
