const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployModule", (m) => {
  // Deploy Token contract
  const Token = m.contract("EIP712MetaTransaction", ["IDk", "1.0"]);

  return {
    Token,
  };
});

//npx hardhat ignition deploy ./ignition/modules/deploy.js --network avalanche
