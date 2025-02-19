import UserSchema, { IUser } from "../Schema/User.schema";
import { generateReferralCode } from "../utils/globals";
import BadgeSchema from "../Schema/User.schema";
import {IBadge} from "../Schema/User.schema";
/**
 * Onboards a new user with the provided wallet address, email, and optional referral code.
 */
export const onboardUser = async (
  wallet_address: string,
  email: string,
  referrer_ref: string | undefined | null
): Promise<IUser> => {
  // Check if the user already exists
  const exising_user = await UserSchema.findOne({
    $or: [{ email }, { wallet_address }],
  });

  if (exising_user) return exising_user;

  // Logic for referral allocation
  if (referrer_ref) {
    const referrer = await UserSchema.findOne({ referral_code: referrer_ref });
    if (referrer) {
      let existing_referrees = referrer.referrals;
      existing_referrees.push({
        email,
        wallet_address,
      });

      await UserSchema.findByIdAndUpdate(referrer._id, {
        referrals: existing_referrees,
      });
    }
  }

  // Generate a referral code for the new user
  const ref_id = generateReferralCode(6);

  let badgeId = "uid";

  let badge = await BadgeSchema.findOne({ uid: badgeId });

  if (!badge) {
    throw "Could not find early adpoters badge";
  }

  // Create a new user
  let new_user = new UserSchema({
    wallet_address,
    role: "user",
    referral_code: ref_id,
    email,
    badges: [{ uid: badge., data_awarded: badge.data_awarded } as unknown as IBadge],
  });

  // Save the new user to the database
  new_user = await new_user.save();

  // Add the Early Adopter badge to the new user

  return new_user;
};

/**
 * Fetches the referrals for a user by their ID.
 */
export const fetchReferrals = async (id: string) => {
  const exising_user = await UserSchema.findById(id);
  if (!exising_user) throw "Could not find user";
  return exising_user?.referrals;
};

/**
 * Fetches a user by their ID.
 */
export const fetchUser = async (id: string) => {
  const exising_user = await UserSchema.findById(id);
  if (!exising_user) throw "Could not find user";
  return exising_user;
};
