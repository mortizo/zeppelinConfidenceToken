const MissionsSoSService = artifacts.require('MissionsSoSService');

contract('MissionsSoSService', accounts => {
  let instancia;
  const creator = accounts[0];
  const investor = accounts[1];
  

  beforeEach(async function () {
    instancia = await MissionsSoSService.new({ from: creator });
  });

  it('Create Mission', async function () {
    
    console.log(await instancia.confidenceTokenName())

    await instancia.setMission("Agilidad en los trámites ciudadanos","#Agility");
    //const totalSupply = await token.totalSupply();
    //const creatorBalance = await token.balanceOf(creator);
    assert.equal((await instancia.mission(0))[1],"Agilidad en los trámites ciudadanos","No se carga bien el cargo");
  });

    
});
