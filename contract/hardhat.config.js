require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    avalanche: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/Q8F6ajRM3Z4bFZz6VmEEydGZPS8fCSHJ",
      chainId: 11155111,
      accounts: [PRIVATE_KEY],
    },
  },
};
