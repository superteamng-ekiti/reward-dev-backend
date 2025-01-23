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
