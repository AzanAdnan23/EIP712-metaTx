const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployModule", (m) => {
  // Deploy Token contract
  const Token = m.contract("Counter");

  return {
    Token,
  };
});

//npx hardhat ignition deploy ./ignition/modules/deploy.js --network sepolia

// DeployModule#Counter - 0xa93aD20484DD8Bf0a76ca609f5c253aacC16a193
// DeployModule#EIP712MetaTransaction - 0xafa24BE840312A282600125cB08E20ea87D30Ac5
