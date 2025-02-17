import BadgesSchema from "../Schema/Badges.schema";
import { generateRandomId } from "../utils/globals";

interface ICreateBadge {
  ipfs_uri: string;
  name: string;
  multiplier: number;
  points: number;
  is_claimable: boolean;
  back_story: string;
}

export const createNewBadge = async (badge_property: ICreateBadge) => {
  const { ipfs_uri, name, multiplier, points, is_claimable, back_story } =
    badge_property;
  const date_created = new Date();

  const uid = generateRandomId(7);
  const new_badge = new BadgesSchema({
    ipfs_uri,
    name,
    uid,
    multiplier,
    points,
    is_claimable,
    back_story,
    date_created
  });

  const badge = await new_badge.save();
  return badge;
};

export const fetchAllBadges = async () => {
  const badges = await BadgesSchema.find().lean();
  return badges;
};
