import { Response } from "express";

type TResponseParams<T> = {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  errors?: T;
};

const sendResponse = <T>(res: Response, data: TResponseParams<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    errors: data.errors,
  });
};

export default sendResponse;
