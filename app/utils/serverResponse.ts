import { Request, Response } from "express";

interface axiosObject {
  req: Request;
  res: Response;
}

export const serverResponse = (
  message: string,
  response: string | Array<string | number> | Object,
  statusCode: number,
  reqRes: axiosObject
) => {
  return reqRes.res.status(statusCode).json({
    message,
    response,
    status: statusCode
  });
};
