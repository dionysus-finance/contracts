import { ethers } from "ethers";

const TOKEN_DECIMALS = ethers.BigNumber.from("10").pow(
  ethers.BigNumber.from("18")
);
const MILLION = ethers.BigNumber.from("10").pow(ethers.BigNumber.from("6"));

const FOUR_MILLION = ethers.BigNumber.from("4")
  .mul(MILLION)
  .mul(TOKEN_DECIMALS);
const TWENTY_MILLION = ethers.BigNumber.from("20")
  .mul(MILLION)
  .mul(TOKEN_DECIMALS);
const PARTNER_MAX = ethers.BigNumber.from("4")
  .mul(MILLION)
  .mul(TOKEN_DECIMALS);

const TEAM_MULTISIG = "0xFCEbe1ADfFEdcb556AD4A4407C726e7398c0faD7";
const TEAM_EOA = "0xFCEbe1ADfFEdcb556AD4A4407C726e7398c0faD7";

const polygonArgs = {

  // Tokens
  WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
  USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",

  // Addresses
  teamEOA: TEAM_EOA,
  teamMultisig: TEAM_MULTISIG,
  emergencyCouncil: "0xFCEbe1ADfFEdcb556AD4A4407C726e7398c0faD7",

  merkleRoot:
    "",
  tokenWhitelist: [
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // WETH
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
  ],
  partnerAddrs: [
    "0xFCEbe1ADfFEdcb556AD4A4407C726e7398c0faD7",
  ],
  partnerAmts: [
    FOUR_MILLION,
  ],
  partnerMax: PARTNER_MAX,
};

export default polygonArgs;