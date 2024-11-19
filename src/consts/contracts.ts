import DEV_SQUARY_ABI from "../../src/abi/dev/SQUARY.json"

const DEVELOPMENT_CONFIGURATION = {
    contracts: {
      SQUARY_CONTRACT: {
        address: "0x364f3828A0FD4A7087590b2F5C083F3CD0AE6d7B", // BASE Test address
        abi: DEV_SQUARY_ABI,
      }
    },
    chainId: 80002,
    chainAmoy: {
      chainId: 80002,
      name: "Amoy",
      currency: "MATIC",
      explorerUrl: "https://www.oklink.com/amoy",
      rpcUrl: "https://rpc-amoy.polygon.technology/",
    },
    chainPolygon: {
      chainId: 137,
      name: "Polygon Mainnet",
      currency: "Matic",
      explorerUrl: "https://polygon-mainnet.infura.io",
      rpcUrl: "https://polygon-mainnet.infura.io"
    },
    baseTestnet: {
      chainId: 84532,
      name: "Base Testnet",
      currency: "BASE",
      explorerUrl: "https://sepolia.basescan.org/",
      rpcUrl: "https://api.developer.coinbase.com/rpc/v1/base-sepolia/aOcbTxSy4UW-rAet6Qc7EQg3cM_enXfH"
    }
  };

  export const APPLICATION_CONFIGURATION = DEVELOPMENT_CONFIGURATION;