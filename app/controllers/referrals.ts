import { Request, Response } from "express";
import { serverResponse } from "../utils/serverResponse";
import { fetchReferrals } from "../core/onboard";

export const fetchReferrralsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;
    const user_referrals = await fetchReferrals(id);
    return serverResponse("here's your referrals", user_referrals, 200, {
      req,
      res
    });
  } catch (error) {
    return serverResponse(
      "something went wrong trying to fetch referrals",
      error as string,
      409,
      {
        req,
        res
      }
    );
  }
};
