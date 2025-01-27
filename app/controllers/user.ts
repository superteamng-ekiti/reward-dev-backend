import { Request, Response } from "express";
import { fetchUser, onboardUser } from "../core/onboard";
import { serverResponse } from "../utils/serverResponse";
import { scout } from "../core/scout";
import UserSchema from "../Schema/User.schema";
import path from "path";
import { fetchRepoPackage } from "../core/octokit";

export const onboardUserController = async (req: Request, res: Response) => {
  try {
    const { wallet_address, email, referral_ref } = req.body;
    let new_user = await onboardUser(wallet_address, email, referral_ref);

    return serverResponse("welcome onboard Dev", new_user as Object, 200, {
      req,
      res,
    });
  } catch (error) {
    serverResponse(
      "something went wrong trying to get you in",
      error as string,
      409,
      {
        req,
        res,
      }
    );
  }
};

export const fetchUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    let user = await fetchUser(id);

    return serverResponse("welcome onboard Dev", user as Object, 200, {
      req,
      res,
    });
  } catch (error) {
    serverResponse("something went wrong finding you", error as string, 409, {
      req,
      res,
    });
  }
};

export const scoutController = async (req: Request, res: Response) => {
  try {
    const { type, access_token, github_url, id } = req.body;
    // type can be js or rs
    if (!access_token) throw "please provide access token";

    const stringified_document = await fetchRepoPackage({
      access_token,
      github_url,
      type,
    });

    const user = await UserSchema.findById(id);
    if (!user) {
      return serverResponse(
        "something went wrong calculating those points",
        "user not found",
        409,
        {
          req,
          res,
        }
      );
    }
    const user_scout =
      type == "js" ? user?.current_scout.javascript : user?.current_scout.rust;

    const existing_scout_index = user_scout?.findIndex(
      (e, i) => e.git_url == github_url
    );

    const do_scout = await scout(
      type,
      github_url,
      stringified_document,
      user_scout && existing_scout_index && existing_scout_index !== -1
        ? user_scout[existing_scout_index].last_checked
        : new Date(),
      user_scout && existing_scout_index && existing_scout_index !== -1
        ? user_scout[existing_scout_index].points
        : 0,
      id
    );

    return serverResponse("awesome 😎", do_scout as Object, 200, { req, res });
  } catch (error) {
    console.log(error);
    serverResponse(
      "something went wrong calculating those points",
      error as string,
      409,
      {
        req,
        res,
      }
    );
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  const { id } = req.body;
  let User = await fetchUser(id);

  // Validate if 'id' is provided
  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Fetch the user by ID
  const user = await fetchUser(id);

  console.log(`id ${id} user: ${user}`);

  // Check if the user was found
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  //Extracting the referral_code and referrals from the users object
  const { referral_code, referrals } = user;

  // Respond with the user's details
  res.status(200).json({ referral_code, referrals  });
};

// {"message":"welcome onboard Dev","response":{"wallet_address":"techwithgwin","createdAt":"2025-01-26T17:38:35.724Z","role":"user","referrals":[],"referral_code":"reO8aHq2_dev","points":0,"current_scout":{"javascript":[],"rust":[]},"_id":"6796777c46064b31f5bbb979","updatedAt":"2025-01-26T17:38:35.724Z","__v":0},"status":200}
