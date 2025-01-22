import type { HydratedDocument } from "mongoose";
import UserSchema, { IUser } from "../Schema/User.schema";

export const findUser = async (
  walletAddress: string
): Promise<HydratedDocument<IUser>> => {
  const user = await UserSchema.findOne({ walletAddress });
  if (user) {
    return user;
  } else throw "User not found";
};
