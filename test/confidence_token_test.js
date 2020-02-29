const ConfidenceToken = artifacts.require('ConfidenceToken');

contract('ConfidenceToken', accounts => {
  
  const _name = "Confidence Token";
  const _symbol = "CFT";
  const _decimals = 18;
  let token;
  
  const creator = accounts[0];
  const investor = accounts[1];

  beforeEach(async function () {
    token = await ConfidenceToken.new(_name, _symbol, _decimals);
  });

  
  it('has a name', async function () {
    const name = await token.name();
    assert.equal(name, 'Confidence Token');
  });

  it('has a symbol', async function () {
    const symbol = await token.symbol();
    assert.equal(symbol, 'CFT');
  });

  it('has 18 decimals', async function () {
    const decimals = await token.decimals();
    assert.equal(decimals,18);
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
