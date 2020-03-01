var ConfidenceToken = artifacts.require('ConfidenceToken');
var MissionsSoSService = artifacts.require('MissionsSoSService');

contract('MissionsSoSService', function(accounts) {
  var tokenInstance;
  var missionInstance;
  var admin = accounts[0];
  var buyer = accounts[1];
  var tokenPrice = 1000000000000000; // in wei
  var tokensAvailable = 750000;
  var numberOfTokens;

  beforeEach(async () => {
    missionInstance = await MissionsSoSService.deployed()
  });

  it('Iniciar el contrato con valores correctos', function() {
    return MissionsSoSService.deployed().then(function(instance) {
      missionInstance = instance;
      return missionInstance.address
    }).then(function(address) {
      assert.notEqual(address, 0x0, 'has contract address');
      return missionInstance.tokenContract();
    }).then(function(address) {
      assert.notEqual(address, 0x0, 'has token contract address');
      return missionInstance.tokenPrice();
    }).then(function(price) {
      assert.equal(price, tokenPrice, 'token price is correct');
    });
  });

  it('Mission 01| Crear misiones con los datos adecuados en las posiciones adecuadas', async() =>{       
    await missionInstance.setMission("Mission 0000","#Mission0000")
    await missionInstance.setMission("Mission 0001","#Mission0001")
    await missionInstance.setMission("Mission 0001.0000","#")
    await missionInstance.setMission("Mission 0001.0001","#")
    await missionInstance.setMission("Mission 0001.0002","#")
    await missionInstance.setMission("Mission 0002.0000","#")
    await missionInstance.setMission("Mission 0002.0001","#")
    assert.equal((await missionInstance.mission(2))[1], "Mission 0001.0000", "La descripción de la tercera misión no coincide")
  });

  it('Permite la compra de tokens', function() {
    return ConfidenceToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return MissionsSoSService.deployed();
    })
    .then(function(instance) {
      missionInstance = instance;
      // Provision 75% of all tokens to the token sale
      return tokenInstance.transfer(missionInstance.address, tokensAvailable, { from: admin })
    })
    .then(function(receipt) {
      numberOfTokens = 10;
      return missionInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
    })
    .then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'SellEvent', 'should be the "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
      return missionInstance.tokensSold();
    })
    .then(function(amount) {
      assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
      return tokenInstance.balanceOf(buyer);
    })
    .then(function(balance) {
      assert.equal(balance.toNumber(), numberOfTokens);
      return tokenInstance.balanceOf(missionInstance.address);
    })
    .then(function(balance) {
      assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
      // Try to buy tokens different from the ether value
      return missionInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
    })
    
   ;

  });

});
/*
  it('initializes the contract with the correct values', function() {
    return DappTokenSale.deployed().then(function(instance) {
      tokenSaleInstance = instance;
      return tokenSaleInstance.address
    }).then(function(address) {
      assert.notEqual(address, 0x0, 'has contract address');
      return tokenSaleInstance.tokenContract();
    }).then(function(address) {
      assert.notEqual(address, 0x0, 'has token contract address');
      return tokenSaleInstance.tokenPrice();
    }).then(function(price) {
      assert.equal(price, tokenPrice, 'token price is correct');
    });
  });

  it('facilitates token buying', function() {
    return DappToken.deployed().then(function(instance) {
      // Grab token instance first
      tokenInstance = instance;
      return DappTokenSale.deployed();
    }).then(function(instance) {
      // Then grab token sale instance
      tokenSaleInstance = instance;
      // Provision 75% of all tokens to the token sale
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
    }).then(function(receipt) {
      numberOfTokens = 10;
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
      return tokenSaleInstance.tokensSold();
    }).then(function(amount) {
      assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
      return tokenInstance.balanceOf(buyer);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), numberOfTokens);
      return tokenInstance.balanceOf(tokenSaleInstance.address);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
      // Try to buy tokens different from the ether value
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
      return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
    });
  });

  it('ends token sale', function() {
    return DappToken.deployed().then(function(instance) {
      // Grab token instance first
      tokenInstance = instance;
      return DappTokenSale.deployed();
    }).then(function(instance) {
      // Then grab token sale instance
      tokenSaleInstance = instance;
      // Try to end sale from account other than the admin
      return tokenSaleInstance.endSale({ from: buyer });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'));
      // End sale as admin
      return tokenSaleInstance.endSale({ from: admin });
    }).then(function(receipt) {
      return tokenInstance.balanceOf(admin);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 999990, 'returns all unsold dapp tokens to admin');
      // Check that the contract has no balance
      balance = web3.eth.getBalance(tokenSaleInstance.address)
      assert.equal(balance.toNumber(), 0);
    });
  });
  */


/*const MissionsSoSService = artifacts.require('MissionsSoSService');

let instancia;

beforeEach(async () => {
    instancia = await MissionsSoSService.new()
});

contract('MissionsSoSService', accounts => {

   
    it('Mission 01| Crear misiones con los datos adecuados en las posiciones adecuadas', async() =>{       
        await instancia.setMission("Mission 0001","#Mission0001")
        await instancia.setMission("Mission 0002","#Mission0002")
        await instancia.setMission("Mission 0001.0001","#")
        await instancia.setMission("Mission 0001.0002","#")
        await instancia.setMission("Mission 0001.0003","#")
        await instancia.setMission("Mission 0002.0001","#")
        assert.equal((await instancia.getMission(2))[1], "Mission 0001.0001", "La descripción de la tercera misión no coincide")
    });
    
    it('Mission 02| Crear misiones e ir actualizando el total de las misiones', async() =>{
        await instancia.setMission("Mission 0001","#Mission0001")
        await instancia.setMission("Mission 0002","#Mission0002")
        await instancia.setMission("Mission 0001.0001","#")
        await instancia.setMission("Mission 0001.0002","#")
        await instancia.setMission("Mission 0001.0003","#")
        await instancia.setMission("Mission 0002.0001","#")       
        assert.equal(await instancia.totalMission(), 6, "Misiones no coinciden con el total de misiones")
    });

    it('Mission 03| Crear superMisiones asignando a misiones ya creadas', async() =>{    
        await instancia.setMission("Mission 0000","#Mission0001")
        await instancia.setMission("Mission 0001","#Mission0002")
        await instancia.setMission("Mission 0000.0001","#")
        await instancia.setMission("Mission 0000.0002","#")
        await instancia.setMission("Mission 0000.0003","#")
        await instancia.setMission("Mission 0001.0001","#")   
        await instancia.setMissionSuperMission(2,0)
        await instancia.setMissionSuperMission(3,0)
        await instancia.setMissionSuperMission(4,1)
        await instancia.setMissionSuperMission(5,1)
    
        assert.equal((await instancia.getMissionSuperMission(3)), 0, "La submisión 3 está asignada a la misión 0")
        assert.equal((await instancia.getMissionSuperMission(5)), 1, "La submisión 5 está asignada a la misión 1")
    });
    
    it('Crear constituyentes con los datos adecuados en las posiciones adecuadas', async() =>{  
        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituent()     
        assert.equal((await instancia.getConstituent(2))[0], 2, "El código del tercer constituyente no coincide")
    });
    
    it('Crear constituyentes e ir actualizando el total de los constituyentes', async() =>{   
        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituent()   
        assert.equal(await instancia.totalConstituent(), 3, "Constituyentes no coinciden con el total de constituyentes")
    });
  
    
    it('Crear estados e ir almacenando los servicios y las misiones', async() =>{
        await instancia.setState(0)
        await instancia.setState(1)
        await instancia.setState(2)
        await instancia.setState(1)       
        assert.equal(await instancia.totalState(), 4, "Estados no coinciden con el total de misiones")
    });
    
    it('Crear parámetros en los constituyentes e ir actualizando el total de los parámetros por constituyente', async() =>{       
        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituentParameter(0, "clave 1.1", "valor 1.1", "descripción 1.1" )
        await instancia.setConstituentParameter(1, "clave 2.1", "valor 2.1", "descripción 2.1" )
        await instancia.setConstituentParameter(1, "clave 2.2", "valor 2.2", "descripción 2.2" )
        await instancia.setConstituentParameter(2, "clave 3.1", "valor 3.1", "descripción 3.1" )
        await instancia.setConstituentParameter(2, "clave 3.2", "valor 3.2", "descripción 3.2" )
        await instancia.setConstituentParameter(2, "clave 3.3", "valor 3.3", "descripción 3.3" )  
        assert.equal(await instancia.totalConstituentParameter(0), 1, "Total de parámetros del constituyente no coinciden")
        assert.equal(await instancia.totalConstituentParameter(1), 2, "Total de parámetros del constituyente no coinciden")
        assert.equal(await instancia.totalConstituentParameter(2), 3, "Total de parámetros del constituyente no coinciden")
    });

    it('Crear parámetros en los constituyentes con los datos adecuados en las posiciones adecuadas', async() =>{       
        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituentParameter(0, "clave 0.0", "valor 0.0", "descripción 0.0" )
        await instancia.setConstituentParameter(1, "clave 1.0", "valor 1.0", "descripción 1.0" )
        await instancia.setConstituentParameter(1, "clave 1.1", "valor 1.1", "descripción 1.1" )
        await instancia.setConstituentParameter(2, "clave 2.0", "valor 2.0", "descripción 2.0" )
        await instancia.setConstituentParameter(2, "clave 2.1", "valor 2.1", "descripción 2.1" )
        await instancia.setConstituentParameter(2, "clave 2.2", "valor 2.2", "descripción 2.2" )   
                 
        assert.equal((await instancia.getConstituentParameter(0,0))[0], "clave 0.0", "La clave del primer constituyente no coincide")
        assert.equal((await instancia.getConstituentParameter(1,1))[1], "valor 1.1", "El valor del segundo constituyente no coincide")
        assert.equal((await instancia.getConstituentParameter(2,2))[2], "descripción 2.2", "La descripción del tercer constituyente no coincide")
    });

    it('Crear servicios en los constituyentes e ir actualizando el total de los servicios por constituyente', async() =>{       
        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituentService(0, "Servicio 0000.0", 0,"https://localhost/servicio001", 3, 3)
        await instancia.setConstituentService(0, "Servicio 0000.1", 0,"https://localhost/servicio002", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.0", 0,"https://localhost/servicio003", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.1", 0,"https://localhost/servicio004", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.2", 0,"https://localhost/servicio005", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.3", 0,"https://localhost/servicio003", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.4", 0,"https://localhost/servicio003", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.5", 0,"https://localhost/servicio003", 3, 3)
        await instancia.setConstituentService(2, "Servicio 0002.0", 0,"https://localhost/servicio003", 3, 3)
        await instancia.setConstituentService(2, "Servicio 0002.1", 0,"https://localhost/servicio003", 3, 3)
        await instancia.setConstituentService(2, "Servicio 0002.2", 0,"https://localhost/servicio003", 3, 3)
    
        
        for(var i=0;i<await instancia.totalConstituent();i++)
        {
            console.log("Numero de constituyente")            
            console.log(i)             
            for(var j=0;j<await instancia.totalConstituentService(i);j++)
            {
                
                console.log("Numero de servicio")            
                console.log(j)   
                
                let _x = await instancia.getConstituentService(i,j)
                
                console.log(_x[0])
                console.log(_x[1])
                console.log(_x[2])
                console.log(_x[3])
                console.log(_x[4])
                console.log(_x[5])
                
            }
        }
        

        assert.equal(await instancia.totalConstituentService(0), 2, "Total de servicios del constituyente no coinciden")
        assert.equal(await instancia.totalConstituentService(1), 6, "Total de servicios del constituyente no coinciden")
        assert.equal(await instancia.totalConstituentService(2), 3, "Total de servicios del constituyente no coinciden")
    });
    

    it('Crear parámetros en los servicios de los constituyentes e ir actualizando el total de parámetros por servicio de los constituyente', async() =>{       
        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituentService(0, "Servicio 0000.0", 0,"https://localhost/servicio001", 3, 3)
        await instancia.setConstituentService(0, "Servicio 0000.1", 0,"https://localhost/servicio002", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.0", 0,"https://localhost/servicio003", 3, 3)
        await instancia.setConstituentService(2, "Servicio 0002.0", 0,"https://localhost/servicio003", 3, 3)
        await instancia.setConstituentServiceParameter(0,0,  "clave 0.0.0", "valor 0.0.0", "descripción 0.0.0" );
        await instancia.setConstituentServiceParameter(0,0,  "clave 0.0.1", "valor 0.0.1", "descripción 0.0.1" );
        await instancia.setConstituentServiceParameter(0,0,  "clave 0.0.2", "valor 0.0.2", "descripción 0.0.2" );
        await instancia.setConstituentServiceParameter(0,0,  "clave 0.0.3", "valor 0.0.3", "descripción 0.0.3" );
        await instancia.setConstituentServiceParameter(0,1,  "clave 0.1.0", "valor 0.1.0", "descripción 0.1.0" );
        await instancia.setConstituentServiceParameter(0,1,  "clave 0.1.1", "valor 0.1.1", "descripción 0.1.1" );
        await instancia.setConstituentServiceParameter(0,1,  "clave 0.1.2", "valor 0.1.2", "descripción 0.1.2" );
        await instancia.setConstituentServiceParameter(1,0,  "clave 1.0.0", "valor 1.0.0", "descripción 1.0.0" );
        await instancia.setConstituentServiceParameter(2,0,  "clave 2.0.0", "valor 2.0.0", "descripción 2.0.0" );
        await instancia.setConstituentServiceParameter(2,0,  "clave 2.0.1", "valor 2.0.1", "descripción 2.0.1" );
        
        
        
        for(var i=0;i<await instancia.totalConstituent();i++)
        {
            console.log("Numero de constituyente")            
            console.log(i)             
            for(var j=0;j<await instancia.totalConstituentService(i);j++)
            {
                for(var k=0;k<await instancia.totalConstituentServiceParameter(i,j);k++)
                {
                
                    console.log("Numero de servicio")            
                    console.log(j)   
                    
                    let _x = await instancia.getConstituentServiceParameter(i,j,k)
                    
                    console.log(_x[0])
                    console.log(_x[1])
                    console.log(_x[2])
                }
            }
        }
        
        

        assert.equal(await instancia.totalConstituentService(0), 2, "Total de servicios del constituyente no coinciden")
        assert.equal(await instancia.totalConstituentService(1), 1, "Total de servicios del constituyente no coinciden")
        assert.equal(await instancia.totalConstituentService(2), 1, "Total de servicios del constituyente no coinciden")
        assert.equal(await instancia.totalConstituentServiceParameter(0,0), 4, "Total de parámetros del servicio del constituyente no coinciden")
        assert.equal(await instancia.totalConstituentServiceParameter(0,1), 3, "Total de parámetros del servicio del constituyente no coinciden")
        assert.equal(await instancia.totalConstituentServiceParameter(1,0), 1, "Total de parámetros del servicio del constituyente no coinciden")
        assert.equal(await instancia.totalConstituentServiceParameter(2,0), 2, "Total de parámetros del servicio del constituyente no coinciden")
    });

    
    it('Crear estados e ir actualizando el total de los estados', async() =>{
        await instancia.setState(0)
        await instancia.setState(1)
        await instancia.setState(2)
        await instancia.setState(1)       
        assert.equal(await instancia.totalState(), 4, "Estados no coinciden con el total de estados")
    });

    it('Asignar misiones y servicios a los estados e ir actualizando el total de las estados misiones', async() =>{
        
        await instancia.setState(0)
        await instancia.setState(1)
        await instancia.setState(2)
        await instancia.setState(1)

        await instancia.setMission("Mission 0000","#Mission0001")
        await instancia.setMission("Mission 0001","#Mission0002")

        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituentService(0, "Servicio 0000.0", 0,"https://localhost/servicio00A", 3, 3)
        await instancia.setConstituentService(0, "Servicio 0000.1", 0,"https://localhost/servicio00B", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.0", 0,"https://localhost/servicio00C", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.1", 0,"https://localhost/servicio00D", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.2", 0,"https://localhost/servicio00E", 3, 3)

        await instancia.setStateMissionConstituentService(3,1,1,2)
                
        assert.equal(( await instancia.getStateMissionConstituentService(3))[0], 3, "Estados misiones constituyentes y servicios almacenados correctamente")
        assert.equal(( await instancia.getStateMissionConstituentService(3))[1], 1, "Estados misiones constituyentes y servicios almacenados correctamente")
        assert.equal(( await instancia.getStateMissionConstituentService(3))[2], 1, "Estados misiones constituyentes y servicios almacenados correctamente")
        assert.equal(( await instancia.getStateMissionConstituentService(3))[3], 2, "Estados misiones constituyentes y servicios almacenados correctamente")
    });

    it('No debe permitir detalles a partir de estados que no existan', async() =>{
        await instancia.setState(0)
        await instancia.setState(1)
        await instancia.setState(2)
        await instancia.setState(1)

        await instancia.setMission("Mission 0000","#Mission0001")
        await instancia.setMission("Mission 0001","#Mission0002")

        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituentService(0, "Servicio 0000.0", 0,"https://localhost/servicio00A", 3, 3)
        await instancia.setConstituentService(0, "Servicio 0000.1", 0,"https://localhost/servicio00B", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.0", 0,"https://localhost/servicio00C", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.1", 0,"https://localhost/servicio00D", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.2", 0,"https://localhost/servicio00E", 3, 3)

        try{
            await instancia.setStateMissionConstituentService(3000,1,1,2)
        }
        catch(e) {return;}
        assert.fail();
    })

        it('No debe permitir crear estados con misiones que no existan', async() =>{
        await instancia.setState(0)
        await instancia.setState(1)
        await instancia.setState(2)
        await instancia.setState(1)

        await instancia.setMission("Mission 0000","#Mission0001")
        await instancia.setMission("Mission 0001","#Mission0002")

        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituentService(0, "Servicio 0000.0", 0,"https://localhost/servicio00A", 3, 3)
        await instancia.setConstituentService(0, "Servicio 0000.1", 0,"https://localhost/servicio00B", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.0", 0,"https://localhost/servicio00C", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.1", 0,"https://localhost/servicio00D", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.2", 0,"https://localhost/servicio00E", 3, 3)

        try{
            await instancia.setStateMissionConstituentService(3,1000,1,2)
        }
        catch(e) {return;}
        assert.fail();
    })
    it('No debe permitir crear estados con constituyentes que no existan', async() =>{
        await instancia.setState(0)
        await instancia.setState(1)
        await instancia.setState(2)
        await instancia.setState(1)

        await instancia.setMission("Mission 0000","#Mission0001")
        await instancia.setMission("Mission 0001","#Mission0002")

        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituentService(0, "Servicio 0000.0", 0,"https://localhost/servicio00A", 3, 3)
        await instancia.setConstituentService(0, "Servicio 0000.1", 0,"https://localhost/servicio00B", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.0", 0,"https://localhost/servicio00C", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.1", 0,"https://localhost/servicio00D", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.2", 0,"https://localhost/servicio00E", 3, 3)

        try{
            await instancia.setStateMissionConstituentService(3,1,1000,2)
        }
        catch(e) {return;}
        assert.fail();
    })
    it('No debe permitir crear estados con servicios que no existan', async() =>{
        await instancia.setState(0)
        await instancia.setState(1)
        await instancia.setState(2)
        await instancia.setState(1)

        await instancia.setMission("Mission 0000","#Mission0001")
        await instancia.setMission("Mission 0001","#Mission0002")

        await instancia.setConstituent()
        await instancia.setConstituent()
        await instancia.setConstituentService(0, "Servicio 0000.0", 0,"https://localhost/servicio00A", 3, 3)
        await instancia.setConstituentService(0, "Servicio 0000.1", 0,"https://localhost/servicio00B", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.0", 0,"https://localhost/servicio00C", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.1", 0,"https://localhost/servicio00D", 3, 3)
        await instancia.setConstituentService(1, "Servicio 0001.2", 0,"https://localhost/servicio00E", 3, 3)

        try{
            await instancia.setStateMissionConstituentService(3,1,1,2000)
        }
        catch(e) {return;}
        assert.fail();
    })
    
    it('Caso 14', async() =>{
        
    })
    
    
});
*/