import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-preprocessor";
import "hardhat-abi-exporter";

import "./tasks/accounts";
import "./tasks/deploy";

import fs from "fs";
import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const remappings = fs
  .readFileSync("remappings.txt", "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => line.trim().split("="));

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
      // forking: {
        // url: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        // blockNumber: 16051852
      // }
    },
    localhost: {
      url: "http://0.0.0.0:8545",
      gasPrice: 16_000_000,
      accounts: [process.env.PRIVATE_KEY]
    },
    polygonMumbai: {
      url: "https://endpoints.omniatech.io/v1/matic/mumbai/public",
      gas: 19_000_000,
      gasPrice: 15_000_000_000,
      gasMultiplier: 1.3,
      accounts: [process.env.PRIVATE_KEY]
    },
    polygonMainnet: {
      url: "https://polygon.llamarpc.com",
      gas: 19_000_000,
      gasPrice: 280_000_000_000,
      gasMultiplier: 1.3,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  // This fully resolves paths for imports in the ./lib directory for Hardhat
  preprocess: {
    eachLine: (hre) => ({
      transform: (line: string) => {
        if (!line.match(/^\s*import /i)) {
          return line;
        }

        const remapping = remappings.find(([find]) => line.match('"' + find));
        if (!remapping) {
          return line;
        }

        const [find, replace] = remapping;
        return line.replace('"' + find, '"' + replace);
      },
    }),
  },
  etherscan: {
    apiKey: {
      polygonMainnet: process.env.POLYGON_SCAN_API_KEY!,
      polygonMumbai: process.env.POLYGON_SCAN_API_KEY!,
    }
  }
};

export default config;
