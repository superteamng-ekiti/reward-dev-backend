import mongoose, { Schema, Document } from "mongoose";

// Define an interface for the 'currentPlan' field
interface IJavascript {
  git_url: string;
  package_json: {
    "@reown/appkit": boolean;
    "@reown/appkit-adapter-solana": boolean;
    "@solana/wallet-adapter-wallets": boolean;
    "@solana/web3.js": boolean;
    "@solana/spl-token": boolean;
  };
  last_checked: Date;
  points: number;
}

interface IRust {
  git_url: string;
  cargo_toml: {};
  last_checked: Date;
  points: number;
}

interface IReferree {
  wallet_address: string;
  email: string;
  referral_count: number;
  points: number;
}

export interface IUser extends Document {
  wallet_address: string;
  createdAt: Date;
  role: "user" | "admin";
  referrals: Array<IReferree>;
  referral_code: string;
  points: number;
  github_username: string;
  current_scout: {
    react?: IJavascript[];
    rust?: IRust[];
  };
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    wallet_address: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: new Date()
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"]
    },
    referrals: [],
    referral_code: String,
    points: {
      type: Number,
      default: 0
    },
    current_scout: {
      react: {
        type: Array<IJavascript>,
        default: null
      },
      rust: {
        type: Array<IRust>,
        default: null
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("rewardeduser", UserSchema);

//  paymentFrequency = daily, weekly, monthly
