const MissionsSoSService = artifacts.require("MissionsSoSService");

module.exports = function(deployer) {
  deployer.deploy(MissionsSoSService);
};