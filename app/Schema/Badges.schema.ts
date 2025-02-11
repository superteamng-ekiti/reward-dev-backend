import mongoose, { Schema, Document } from "mongoose";

export interface IBadge extends Document {
  name: string;
  uid: string;
  points: number;
  is_claimable: boolean;
  back_story: string;
  date_created: Date;
}

const BadgeSchema: Schema<IBadge> = new mongoose.Schema(
  {
    name: String,
    uid: String,
    points: Number,
    is_claimable: Boolean,
    back_story: String,
    date_created: Date
  },
  { timestamps: true }
);

export default mongoose.model<IBadge>("badge", BadgeSchema);
