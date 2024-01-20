// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract LandRegistration is ERC721Enumerable {
    ERC20 public fractionalToken;
    address public owner;
    uint256 private _tokenIdCounter = 0;

    struct LandToken{
        string name;
        string description;
        address[] fractinalOwners;
        uint256[] fractionalAmounts;
    }
    struct FractionalOwnership{
        uint256 tokenId;
        uint256 amount;
    }

    mapping(uint256 => LandToken) private _landTokens;
    mapping(address => FractionalOwnership[]) private _fractionalOwnerships;

    constructor(address _fractionalToken) ERC721("FractionalLandRegistration", "FLR") {
        owner = msg.sender;
        fractionalToken = ERC20(_fractionalToken);
    }

    function mint(
        address[] memory fractinalOwners,
        uint256[] memory fractionalAmounts,
        string memory name,
        string memory description
    ) public {
        _tokenIdCounter++;
        _mint(address(this), _tokenIdCounter);
        _landTokens[_tokenIdCounter] = LandToken(
            name,
            description,
            fractinalOwners,
            fractionalAmounts
        );

        for (uint256 i = 0; i < fractinalOwners.length; i++) {
            fractionalToken.transfer(fractinalOwners[i], fractionalAmounts[i] * 10**18);
            _fractionalOwnerships[fractinalOwners[i]].push(
                FractionalOwnership(_tokenIdCounter, fractionalAmounts[i])
            );
        }
    }

    function transferFractionalOwnership(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) public {
        require(
            fractionalToken.balanceOf(from) >= amount,
            "FractionalToken: Not enough balance"
        );
        fractionalToken.transferFrom(from, to, amount);
        _fractionalOwnerships[from].push(FractionalOwnership(tokenId, amount));
        for (uint256 i = 0; i < _fractionalOwnerships[from].length; i++) {
            if (_fractionalOwnerships[from][i].tokenId == tokenId ) {
                _fractionalOwnerships[from][i].amount -= amount;
                if(_fractionalOwnerships[from][i].amount == 0){
                    delete _fractionalOwnerships[from][i];
                    for(uint256 j = 0; j < _landTokens[tokenId].fractinalOwners.length; j++){
                        if(_landTokens[tokenId].fractinalOwners[j] == from){
                            _landTokens[tokenId].fractinalOwners[j] = to;
                        }
                    }
                }else{
                    for(uint256 j = 0; j < _landTokens[tokenId].fractinalOwners.length; j++){
                        if(_landTokens[tokenId].fractinalOwners[j] == from){
                            _landTokens[tokenId].fractionalAmounts[j] = _fractionalOwnerships[from][i].amount;
                        }
                    }
                    _landTokens[tokenId].fractinalOwners.push(to);
                    _landTokens[tokenId].fractionalAmounts.push(amount);

                }
                break;
            }
        }
        _fractionalOwnerships[to].push(FractionalOwnership(tokenId, amount));
    }


    function getFractionalOwnerships(address _owner) public view returns(FractionalOwnership[] memory){
        return _fractionalOwnerships[_owner];
    }

}
