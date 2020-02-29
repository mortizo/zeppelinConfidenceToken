pragma solidity  >=0.5.16 <0.7.0;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ConfidenceToken.sol";


contract PruebaToken{

    using SafeMath for uint;
    //-------------Token-------------
    ConfidenceToken public confidenceToken;

    function confidenceTokenName() public view returns (string memory) {
        return confidenceToken.name();
    }

    //--------Constructor---------

    constructor() public{
        confidenceToken = ConfidenceToken(0x2eA0573fFd6543c0E87093219f2F73D231a1a8D5);
    }


    //--------Ver Aprobaciones---------

    function getAprobaciones(address _owner, address _spender) public view returns(uint256)
    {
        return confidenceToken.allowance(_owner,_spender);
    }

    //--------Ver Balances---------

    function getBalance(address _address) public view returns(uint256)
    {
        return confidenceToken.balanceOf(_address);
    }


    //--------Hacer Transferencias--------
    function setTransferencia(address _addressRecipient, uint256 _monto) external
    {
        
    }

}