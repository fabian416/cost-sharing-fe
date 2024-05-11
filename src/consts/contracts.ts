import DEV_SQUARY_ABI from "../../src/abi/dev/SQUARY.json"

const DEVELOPMENT_CONFIGURATION = {
    contracts: {
      SQUARY_CONTRACT: {
        address: "0x83dca6620196970A796881B77887f3ad9Dd4581d",
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
    }
  };

  export const APPLICATION_CONFIGURATION = DEVELOPMENT_CONFIGURATION;