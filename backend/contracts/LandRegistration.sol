// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract LandRegistration is ERC721Enumerable {
    address public owner;
    uint256 public _tokenIdCounter = 0;

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

    mapping(uint256 => LandToken) public _landTokens;
    mapping(address => FractionalOwnership[]) public _fractionalOwnerships;

    constructor() ERC721("FractionalLandRegistration", "FLR") {
        owner = msg.sender;
    }

    function mint(
        address[] memory fractinalOwners,
        uint256[] memory fractionalAmounts,
        string memory name,
        string memory description
    ) public {
        require(owner == msg.sender, "LandRegistration: only owner can mint");
        require(
            fractinalOwners.length == fractionalAmounts.length,
            "LandRegistration: fractional owners and fractional amounts length mismatch"
        );
        _tokenIdCounter++;
        _mint(address(this), _tokenIdCounter);
        _landTokens[_tokenIdCounter] = LandToken(
            name,
            description,
            fractinalOwners,
            fractionalAmounts
        );

        for (uint256 i = 0; i < fractinalOwners.length; i++) {
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
            _fractionalOwnerships[from].length > 0,
            "LandRegistration: fractional ownership not found"
        );
        FractionalOwnership[] memory fractionalOwnerships = _fractionalOwnerships[from];
        for (uint256 i = 0; i < fractionalOwnerships.length; i++) {
            if (fractionalOwnerships[i].tokenId == tokenId) {
                require(
                    fractionalOwnerships[i].amount >= amount,
                    "LandRegistration: fractional ownership amount exceeded"
                );
                break;
            }
        }
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

    function burnFractionalOwnership(
        address from,
        uint256 tokenId,
        uint256 amount
    ) public {
        require(owner == msg.sender, "LandRegistration: only owner can mint");
        require(
            _fractionalOwnerships[from].length > 0,
            "LandRegistration: fractional ownership not found"
        );
        FractionalOwnership[] memory fractionalOwnerships = _fractionalOwnerships[from];
        for (uint256 i = 0; i < fractionalOwnerships.length; i++) {
            if (fractionalOwnerships[i].tokenId == tokenId) {
                require(
                    fractionalOwnerships[i].amount >= amount,
                    "LandRegistration: fractional ownership amount exceeded"
                );
                break;
            }
        }
        for (uint256 i = 0; i < _fractionalOwnerships[from].length; i++) {
            if (_fractionalOwnerships[from][i].tokenId == tokenId ) {
                _fractionalOwnerships[from][i].amount -= amount;
                if(_fractionalOwnerships[from][i].amount == 0){
                    delete _fractionalOwnerships[from][i];
                    for(uint256 j = 0; j < _landTokens[tokenId].fractinalOwners.length; j++){
                        if(_landTokens[tokenId].fractinalOwners[j] == from){
                            delete _landTokens[tokenId].fractinalOwners[j];
                            delete _landTokens[tokenId].fractionalAmounts[j];
                        }
                    }
                }else{
                    for(uint256 j = 0; j < _landTokens[tokenId].fractinalOwners.length; j++){
                        if(_landTokens[tokenId].fractinalOwners[j] == from){
                            _landTokens[tokenId].fractionalAmounts[j] = _fractionalOwnerships[from][i].amount;
                        }
                    }
                }
                break;
            }
        }
       
    }

    function getFractionalOwnerships(address _owner) public view returns(FractionalOwnership[] memory){
        return _fractionalOwnerships[_owner];
    }
    

    function getDetailedFractionOwnership() public view returns(LandToken[] memory){
        FractionalOwnership[] memory fractionalOwnerships = _fractionalOwnerships[msg.sender];
        if(fractionalOwnerships.length == 0){
            return new LandToken[](0);
        }
        LandToken[] memory landTokens = new LandToken[](fractionalOwnerships.length);
        for(uint256 i = 0; i < fractionalOwnerships.length; i++){
            landTokens[i] = _landTokens[fractionalOwnerships[i].tokenId];
        }

        return landTokens;
    }

    function getLandTokenById(uint256 tokenId) public view returns(LandToken memory){
        return _landTokens[tokenId];
    }

    function isOwner() public view returns (bool) {
        return owner == msg.sender;
    }  

}
