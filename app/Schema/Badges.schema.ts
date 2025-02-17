import mongoose, { Schema, Document } from "mongoose";

export interface IBadge extends Document {
  name: string;
  uid: string;
  points: number;
  ipfs_uri: string;
  is_claimable: boolean;
  back_story: string;
  multiplier: number;
  date_created: Date;
}

const BadgeSchema: Schema<IBadge> = new mongoose.Schema(
  {
    name: { type: String, unique: [true, "name already exists"] },
    uid: { type: String, unique: [true, "uid already exists"] },
    points: Number,
    ipfs_uri: { type: String, unique: [true, "uri already exists"] },
    is_claimable: Boolean,
    back_story: String,
    date_created: Date,
    multiplier: Number
  },
  { timestamps: true }
);

export default mongoose.model<IBadge>("badge", BadgeSchema);
