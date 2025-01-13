const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeployModule", (m) => {
  // Deploy Token contract
  const Token = m.contract("EIP712MetaTransaction", [
    "EIP712MetaTransaction",
    "1",
  ]);

  return {
    Token,
  };
});

//npx hardhat ignition deploy ./ignition/modules/deploy.js --network avalanche
