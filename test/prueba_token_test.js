const PruebaToken = artifacts.require('PruebaToken');

contract('PruebaToken', accounts => {
  
  const _name = "Confidence Token";
  const _symbol = "CFT";
  const _decimals = 18;
  let token;
  
  const creator = accounts[0];
  const investor = accounts[1];
  

  beforeEach(async function () {
    instancia = await PruebaToken.new({ from: creator });
  });

  it('Verificar balances', async function () {

    let i;
    for (i=0;i<10;i++)
    {
      console.log(accounts[i]);
      console.log((await instancia.getBalance(accounts[i])).toNumber());
    }

    assert.equal((await instancia.getBalance(creator)).toNumber(),10000000000,"NO es el total de monedas");
    assert.equal((await instancia.getBalance(investor)).toNumber(),0,"NO es el total de monedas");
    assert.equal((await instancia.getBalance(accounts[2])).toNumber(),0,"NO es el total de monedas");
    assert.equal((await instancia.getBalance(accounts[3])).toNumber(),0,"NO es el total de monedas");

  });
  
  it('Realizar transferencias', async function () {


    await instancia.setTransferencia(investor, 29);

    //console.log((await token.getAprobaciones(creator,investor)).toNumber())
  
  });

    
});
