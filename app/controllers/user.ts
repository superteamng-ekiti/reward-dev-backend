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

export const fetchUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    let user = await fetchUser(id);

    return serverResponse("welcome onboard Dev", user as Object, 200, {
      req,
      res
    });
  } catch (error) {
    serverResponse("something went wrong finding you", error as string, 409, {
      req,
      res
    });
  }
};

export const scoutController = async (req: Request, res: Response) => {
  try {
    const { type, access_token, github_url, id } = req.body;
    let permited_type = ["js", "rs"];
    // type can be js or rs
    if (!access_token) throw "please provide access token";
    if (type && !permited_type.includes(type)) throw "invalid type js or rs";

    const stringified_document = await fetchRepoPackage({
      access_token,
      github_url,
      type
    });

    const user = await UserSchema.findById(id);
    if (!user) {
      return serverResponse(
        "something went wrong calculating those points",
        "user not found",
        409,
        {
          req,
          res
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
        res
      }
    );
  }
};
