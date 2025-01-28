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

export const getUserDetails = async (req: Request, res: Response) => {
  const { id } = req.body;

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

  // Extracting the referral_code and referrals from the users object
  const { referral_code, referrals } = user;

  // Respond with the user's details
  res.status(200).json({ referral_code, referrals });
};

export const leaderboardController = async (req: Request, res: Response) => {
  try {
    let page = 1;
    const pageSize = 10; // Number of documents per page
    const skip = (page - 1) * pageSize; // Calculate the number of documents to skip

    const results = await UserSchema.find({})
      .select("wallet_address points referrals") // Include only wallet_address, email, and points
      .sort({ points: -1 }) // Sort by points in descending order
      .skip(skip) // Skip documents for previous pages
      .limit(pageSize) // Limit the number of documents to the page size
      .exec();

    return serverResponse("leaders 🎊 😎", results as Object, 200, {
      req,
      res
    });
  } catch (error) {
    return serverResponse("Error fetching leaderboard", error as string, 500, {
      req,
      res
    });
  }
};
