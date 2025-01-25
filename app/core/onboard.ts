import UserSchema, * as User from "../Schema/User.schema";
import { generateReferralCode } from "../utils/globals";

export const onboardUser = async (
  wallet_address: string,
  email: string,
  referrer_ref: string | undefined | null
) => {
  const exising_user = await UserSchema.findOne({ wallet_address });
  if (exising_user) throw "User already exists";

  // logic for referral allocation
  if (referrer_ref) {
    const referrer = await UserSchema.findOne({ referral_code: referrer_ref });
    if (referrer) {
      let existing_referrees = referrer.referrals;
      existing_referrees.push({
        email,
        wallet_address
      });

      await UserSchema.findByIdAndUpdate(referrer._id, {
        referrals: existing_referrees
      });
    }
  }

  const ref_id = generateReferralCode(6);
  let new_user = new UserSchema({
    wallet_address,
    role: "user",
    referral_code: ref_id
  });

  new_user = await new_user.save();
  return new_user;
};

export const fetchReferrals = async (id: string) => {
  const exising_user = await UserSchema.findById(id);
  if (!exising_user) throw "could not find user";
  return exising_user?.referrals;
};
