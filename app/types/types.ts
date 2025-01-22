type Chain =
  | "ethereum"
  | "binanceSmartChain"
  | "polygon"
  | "arbitrum"
  | "optimism"
  | "base"
  | "linea"
  | "fantom"
  | "cronos"
  | "palm"
  | "gnosis"
  | "chiliz"
  | "moonbeam"
  | "avalanche";

type pnlDuration = "all" | "7" | "30" | "60" | "90";

type supportedChain = "0x1" | "0x2105" | "0xe708" | "0x89" | "0x38" | "0xa4b1";

type gemStrategies =
  | "moonshotpicks"
  | "rocketboosters"
  | "diamondgems"
  | "turbogrowth"
  | "solidsteppers";

type ChainIDsHex = {
  ethereum: "0x1" | "eth" | "mainnet"; // Ethereum Mainnet
  binanceSmartChain: "0x38" | "bsc" | "binance"; // Binance Smart Chain Mainnet
  polygon: "0x89" | "matic" | "polygon"; // Polygon Mainnet
  arbitrum: "0xa4b1" | "arbitrum"; // Arbitrum One Mainnet
  optimism: "0xa" | "optimism"; // Optimism Mainnet
  base: "0x2105" | "base"; // Base Mainnet
  linea: "0xe708" | "linea"; // Linea Mainnet
  fantom: "0xfa" | "ftm" | "fantom"; // Fantom
  cronos: "0x19" | "cronos"; // Cronos
  palm: "0x2a15c308d" | "palm"; // Palm
  gnosis: "0x64" | "gnosis"; // Gnosis
  chiliz: "0x15b38" | "chiliz"; // Chiliz
  moonbeam: "0x504" | "moonbeam"; // Moonbeam
  avalanche: "0xa86a" | "avalanche"; // Avalanche
};

export { Chain, pnlDuration, ChainIDsHex, supportedChain, gemStrategies };
