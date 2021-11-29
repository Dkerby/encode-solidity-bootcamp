const Migrations = artifacts.require("Migrations");
const VolcanoToken = artifacts.require("VolcanoToken");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(VolcanoToken);
};

