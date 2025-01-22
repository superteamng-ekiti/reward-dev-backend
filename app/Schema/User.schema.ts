import mongoose, { Schema, Document } from "mongoose";

// Define an interface for the 'currentPlan' field
interface IReact {
  github_username: string;
  package_json: string;
  initialPaymentDate: string;
  paymentFrequency: string;
  paymentCount: number;
}

interface IRust {
  paymentId: string;
  price: string;
  initialPaymentDate: string;
  paymentFrequency: string;
  paymentCount: number;
}

// Define an interface for the user document
export interface IUser extends Document {
  walletAddress: string;
  createdAt: Date;
  role: "user" | "admin";
  currentScout: IReact | IRust;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    walletAddress: {
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
    currentScout: {
      type: {
        paymentId: { type: String, default: "" },
        price: { type: String, default: "" },
        initialPaymentDate: { type: String, default: "" },
        paymentFrequency: { type: String, default: "" },
        paymentCount: { type: Number, default: 0 }
      },
      default: {}
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("rewardeduser", UserSchema);

//  paymentFrequency = daily, weekly, monthly
