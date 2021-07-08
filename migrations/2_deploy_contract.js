const BestToken = artifacts.require("./BestToken");

module.exports = function (deployer) {
  deployer.deploy(BestToken);
};
