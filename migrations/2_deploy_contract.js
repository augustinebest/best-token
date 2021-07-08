const BestToken = artifacts.require("./BestToken");

module.exports = function (deployer) {
  deployer.deploy(BestToken, 1000000);
};
