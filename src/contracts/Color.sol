pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Color is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  mapping(string => bool) _colorExists;
  string[] public colors;

  constructor() public ERC721 ("Color", "COLOR"){}

    //E.G. Color - "#FFFFFF"

    function awardItem(string memory _tokenURI) public returns (uint256) {
      //Require unique color
      require(!_colorExists[_tokenURI]);
      colors.push(_tokenURI);

      _tokenIds.increment();

      uint256 newItemId = _tokenIds.current();
      _mint(msg.sender, newItemId);
      _setTokenURI(newItemId, _tokenURI);
      _colorExists[_tokenURI] = true;

      return newItemId;
    }
}
