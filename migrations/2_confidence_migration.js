const ConfidenceToken = artifacts.require("ConfidenceToken");
var DappTokenSale = artifacts.require("DappTokenSale.sol");

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
    return deployer.deploy(DappTokenSale, ConfidenceToken.address, tokenPrice);
  });
};

/*
const ConfidenceToken = artifacts.require("ConfidenceToken");

module.exports = function(deployer) {
  deployer.deploy(ConfidenceToken);
};
*/