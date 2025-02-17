import mongoose, { Schema, Document } from "mongoose";

// Define an interface for the 'currentPlan' field
export interface IJavascript {
  git_url: string;
  package_json: {
    "@reown/appkit": boolean;
    "@reown/appkit-adapter-solana": boolean;
    "@solana/wallet-adapter-wallets": boolean;
    "@solana/web3.js": boolean;
    "@solana/spl-token": boolean;
    "@solana/wallet-adapter-base": boolean;
    "@solana/wallet-adapter-react": boolean;
    "@solana/wallet-adapter-react-ui": boolean;
  };
  last_checked: Date;
  points: number;
}

export interface IRust {
  git_url: string;
  cargo_toml: {
    "spl-token": boolean;
    "anch-lang": boolean;
    "solana-program": boolean;
    "solana-sdk": boolean;
  };
  last_checked: Date;
  points: number;
}

interface IReferree {
  wallet_address: string;
  email: string;
}

interface IBadge {
  uid: string;
  date_awarded: Date;
}

export interface IUser extends Document {
  wallet_address: string;
  createdAt: Date;
  email: string;
  role: "user" | "admin";
  referrals: Array<IReferree>;
  referral_code: string;
  points: number;
  github_username: string;
  badges: Array<IBadge>;
  current_scout: {
    javascript?: IJavascript[];
    rust?: IRust[];
  };
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    wallet_address: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
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
    badges: [],
    current_scout: {
      javascript: {
        type: Array<IJavascript>,
        default: []
      },
      rust: {
        type: Array<IRust>,
        default: []
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("rewardeduser", UserSchema);

//  paymentFrequency = daily, weekly, monthly
