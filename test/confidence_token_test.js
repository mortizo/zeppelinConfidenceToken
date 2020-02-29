const ConfidenceToken = artifacts.require('ConfidenceToken');

contract('ConfidenceToken', accounts => {
  let token;
  const creator = accounts[0];
  const investor = accounts[1];
  

  beforeEach(async function () {
    token = await ConfidenceToken.new({ from: creator });
  });

  
  it('has a name', async function () {
    const name = await token.name();
    assert.equal(name, 'ConfidenceToken');
  });

  it('has a symbol', async function () {
    const symbol = await token.symbol();
    assert.equal(symbol, 'TKCONF');
  });

  it('has 18 decimals', async function () {
    const decimals = await token.decimals();
    assert.equal(decimals,2);
  });

  it('assigns the initial total supply to the creator', async function () {
    const totalSupply = await token.totalSupply();
    const creatorBalance = await token.balanceOf(creator);
    assert.equal(creatorBalance.toNumber(),totalSupply.toNumber());
  });

  it("transfer token to the investor", async function() {
    await token.transfer(investor, 1000, { from: creator });
    const investorBalance = await token.balanceOf(investor);
    assert.equal(investorBalance.toNumber(),1000);
  });
  
    
});

//const ConfidenceToken = artifacts.require("ConfidenceToken");

//contract("ConfidenceToken", function() {

  /*
const ConfidenceToken = artifacts.require('ConfidenceToken');

let token;

beforeEach(async () => {
    token = await ConfidenceToken.new()
});

contract('ConfidenceToken', accounts => {

   
  it("assigns the initial total supply to the creator", async() =>{      
        
  });
  it("assigns the initial total supply to the creator", async() =>{      
        
  });
  it("assigns the initial total supply to the creator", async() =>{      
        
  });
  it("assigns the initial total supply to the creator", async() =>{      
        
  });
  it("assigns the initial total supply to the creator", async() =>{      
        
  });
  it("assigns the initial total supply to the creator", async() =>{      
        
  });

});

/*
  //it("should assert true", async function(done) {
    //await ConfidenceToken.deployed();
    //assert.isTrue(true);
   // done();
  //});
//});

//const { expectThrow } = require("../helpers/expectThrow");
//const { EVMRevert } = require("../helpers/EVMRevert");
const SampleToken = artifacts.require("ConfidenceToken");
const BigNumber = web3.BigNumber;
require("chai")
.use(require("chai-bignumber")(BigNumber))
.should();
contract("SampleToken", function([_, owner, investor]) {
let token;
const _name = "SampleToken";
const _symbol = "STK";
const _decimals = 18;
const _total_supply = new BigNumber(1000000);
const _over_total_supply = new BigNumber(1100000000000000000000000);
beforeEach(async function() {
token = await SampleToken.new(_name, _symbol, _decimals, _total_supply, {
from: owner
});
});
it("has a name", async function() {
(await token.name()).should.eq(_name);
});
it("has a symbol", async function() {
(await token.symbol()).should.eq(_symbol);
});
it("has 18 decimals", async function() {
(await token.decimals()).should.be.bignumber.equal(_decimals);
});
it(
"has " + String(1000000000000000000000000) + " total supply",
async function() {
(await token.totalSupply()).should.be.bignumber.equal(1000000000000000000000000);
}
);
it("assigns the initial total supply to the creator", async function() {
const totalSupply = await token.totalSupply();
const ownerBalance = await token.balanceOf(owner);
ownerBalance.should.be.bignumber.equal(totalSupply);
});
it("transfer token to the investor", async function() {
await token.transfer(investor, 1000, { from: owner });
const investorBalance = await token.balanceOf(investor);
investorBalance.should.be.bignumber.equal(1000);
});
it("transfer token to the investor", async function() {
await token.transfer(investor, 1000, { from: owner });
const investorBalance = await token.balanceOf(investor);
investorBalance.should.be.bignumber.equal(1000);
});
it("should reject transfer token(more than has) to the investor", async function() {
await expectThrow(
token.transfer(investor, _over_total_supply, { from: owner }),
EVMRevert
);
});
});*/
