import * as User from "../Schema/User.schema";
import { findUser } from "./user";
// import {valid} from "@solana/web3.js"

const createUser = async (walletAddress: string) => {
  const exising_user = findUser(walletAddress);
};
