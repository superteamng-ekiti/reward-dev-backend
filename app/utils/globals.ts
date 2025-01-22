import { Chain, ChainIDsHex, supportedChain } from "../types/types";

export const log = console.log;
export const err = console.error;

export const solidLogger = (message: string): void => {
  console.log("=====================================");
  console.log(message);
  console.log("=====================================");
};

export const ChainIDs: ChainIDsHex = {
  ethereum: "0x1",
  base: "0x2105",
  linea: "0xe708",
  polygon: "0x89",
  binanceSmartChain: "0x38",
  arbitrum: "0xa4b1",
  optimism: "0xa",
  fantom: "0xfa",
  cronos: "0x19",
  palm: "0x2a15c308d",
  gnosis: "0x64",
  chiliz: "0x15b38",
  moonbeam: "0x504",
  avalanche: "0xa86a"
};

export const chainIdMapping: Record<string, string> = {
  eth: "0x1",
  mainnet: "0x1",
  ethereum: "0x1",
  bsc: "0x38",
  binance: "0x38",
  binanceSmartChain: "0x38",
  matic: "0x89",
  polygon: "0x89",
  arbitrum: "0xa4b1",
  optimism: "0xa",
  base: "0x2105",
  linea: "0xe708",
  ftm: "0xfa",
  fantom: "0xfa",
  cronos: "0x19",
  palm: "0x2a15c308d",
  gnosis: "0x64",
  chiliz: "0x15b38",
  moonbeam: "0x504",
  avalanche: "0xa86a"
};

export const mapToHex = (chainInput: string | string[]): Chain[] => {
  if (Array.isArray(chainInput)) {
    return chainInput.map(
      (chain) => chainIdMapping[chain.toLowerCase()] as Chain
    );
  } else {
    return [chainIdMapping[chainInput.toLowerCase()] as Chain];
  }
};

export const resolveChain = (chain: Chain): supportedChain => {
  if (chain === "ethereum") {
    return "0x1";
  } else if (chain === "binanceSmartChain") {
    return "0x38";
  } else if (chain === "polygon") {
    return "0x89";
  } else if (chain === "arbitrum") {
    return "0xa4b1";
  } else if (chain === "base") {
    return "0x2105";
  } else if (chain === "linea") {
    return "0xe708";
  } else {
    return "0x1";
  }
};
