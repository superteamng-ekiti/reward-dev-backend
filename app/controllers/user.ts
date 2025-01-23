import { Request, Response } from "express";
import { onboardUser } from "../core/onboard";
import { serverResponse } from "../utils/serverResponse";

export const onboardUserController = async (req: Request, res: Response) => {
  try {
    const { wallet_address, email, referral_ref } = req.body;
    let new_user = await onboardUser(wallet_address, email, referral_ref);

    delete new_user?._id;
    delete new_user?.__v;
    // delete new_user.createdAt;

    return serverResponse("welcome onboard Dev", new_user as Object, 200, {
      req,
      res
    });
  } catch (error) {
    serverResponse(
      "something went wrong trying to get you in",
      error as string,
      409,
      {
        req,
        res
      }
    );
  }
};
