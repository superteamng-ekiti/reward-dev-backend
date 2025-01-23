import type { IJavascript, IRust } from "../Schema/User.schema";
import { Chain, ChainIDsHex, supportedChain } from "../types/types";

export const log = console.log;
export const err = console.error;

export const solidLogger = (message: string): void => {
  console.log("=====================================");
  console.log(message);
  console.log("=====================================");
};

export const generateReferralCode = (length = 5): string => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return "re" + result + "_dev";
};

export const JSPOINTS = {
  "@reown/appkit": 200,
  "@reown/appkit-adapter-solana": 150,
  "@solana/wallet-adapter-wallets": 150,
  "@solana/web3.js": 250,
  "@solana/spl-token": 250
};

export const RUSTPOINTS = {
  spl_token: 300,
  solana_sdk: 400,
  anchor_lang: 300
};

export const awardPointsJS = (dependencies: IJavascript): IJavascript => {
  let accumulated_points = 0;
  const package_json = dependencies.package_json;

  Object.entries(JSPOINTS).forEach(([key, points]) => {
    if (key in package_json && package_json[key as keyof typeof package_json]) {
      accumulated_points += points;
    }
  });

  dependencies.last_checked = new Date();

  return {
    ...dependencies,
    points: accumulated_points
  };
};

export const awardPointsRS = (dependencies: IRust): IRust => {
  let accumulated_points = 0;
  const cargo_toml = dependencies.cargo_toml;

  Object.entries(RUSTPOINTS).forEach(([key, points]) => {
    if (key in cargo_toml && cargo_toml[key as keyof typeof cargo_toml]) {
      accumulated_points += points;
    }
  });

  dependencies.last_checked = new Date();

  return {
    ...dependencies,
    points: accumulated_points
  };
};
