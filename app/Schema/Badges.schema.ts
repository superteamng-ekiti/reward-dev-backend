import mongoose, { Schema, Document } from "mongoose";

export interface IBadge extends Document {
  name: string;
  points: number;
  is_claimable: boolean;
  date_awarded: Date;
}

const BadgeSchema: Schema<IBadge> = new mongoose.Schema(
  {
    name: String,
    points: Number,
    is_claimable: Boolean,
    date_awarded: Date
  },
  { timestamps: true }
);

export default mongoose.model<IBadge>("badge", BadgeSchema);
