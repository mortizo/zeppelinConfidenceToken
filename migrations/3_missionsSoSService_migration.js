const ConfidenceToken = artifacts.require("ConfidenceToken");
const MissionsSoSService = artifacts.require("MissionsSoSService");

const _name = "Confidence Token";
const _symbol = "CFT";
const _decimals = 18;

//module.exports = function(deployer) {
//  deployer.deploy(ConfidenceToken, _name, _symbol, _decimals);
//};


module.exports = function(deployer) {
  deployer.deploy(ConfidenceToken, _name, _symbol, _decimals).then(function() {
    // Token price is 0.001 Ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(MissionsSoSService, ConfidenceToken.address, tokenPrice);
  });
};


/*const MissionsSoSService = artifacts.require("MissionsSoSService");

module.exports = function(deployer) {
  deployer.deploy(MissionsSoSService);
};
*/