const ConfidenceToken = artifacts.require("ConfidenceToken");

const _name = "Confidence Token";
const _symbol = "CFT";
const _decimals = 18;

module.exports = function(deployer) {
  deployer.deploy(ConfidenceToken, _name, _symbol, _decimals);
};

/*
const ConfidenceToken = artifacts.require("ConfidenceToken");

module.exports = function(deployer) {
  deployer.deploy(ConfidenceToken);
};
*/