pragma solidity >=0.5.0 <0.7.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract ConfidenceToken is ERC20Detailed, ERC20, Ownable{

  constructor () public ERC20Detailed("TokenConfidence", "TKCONF", 18) {
        _mint(owner(), 10000 * (10 ** uint256(decimals())));
  }

}
