const VolcanoToken = artifacts.require("VolcanoToken");

module.exports = async function (deployer, network, accounts) {
    // deployment steps
    await deployer.deploy(VolcanoToken);
};