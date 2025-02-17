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
  return "re" + generateRandomId() + "_dev";
};

export const generateRandomId = (length = 5): string => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const JSPOINTS = {
  "@reown/appkit": 200,
  "@reown/appkit-adapter-solana": 150,
  "@solana/wallet-adapter-wallets": 150,
  "@solana/web3.js": 250,
  "@solana/spl-token": 250,
  "@solana/wallet-adapter-base": 150,
  "@solana/wallet-adapter-react": 150,
  "@solana/wallet-adapter-react-ui": 150
};

export const RUSTPOINTS = {
  "spl-token": 300,
  "anch-lang": 200,
  "solana-program": 300,
  "solana-sdk": 400,
  "spl-associated-token-account": 300
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
    if (key in cargo_toml) {
      // console.log(`Dependency ${key} exists with value: ${cargo_toml[key]}`);
      if (cargo_toml[key as keyof typeof cargo_toml]) {
        accumulated_points += points;
      }
    } else {
      console.log(`Dependency ${key} not found`);
    }
  });

  dependencies.last_checked = new Date();

  return {
    ...dependencies,
    points: accumulated_points
  };
};
