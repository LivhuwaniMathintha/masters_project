// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FunderRegistry
 * @dev Stores funders and allows retrieval for integration with Nethereum and C# DTO mapping.
 */
contract FunderRegistry {
    struct Funder {
        bytes16 id;                 // Unique identifier for the funder (Guid)
        string name;               // Name of the funder
        bool isActive;             // Current active status
        bytes16 funderContractId;  // Link to FundingContract (Guid)
        bool isChangeConfirmed;    // Change confirmation status
        string paymentDate;        // Payment date (string)
        string modifiedBy;         // Last modifier
        string updatedAt;          // Last update timestamp
    }

    Funder[] private funders;
    mapping(bytes16 => uint256) private funderIndex; // For quick lookup

    event FunderAdded(bytes16 indexed id, string name);

    function addFunder(
        bytes16 _id,
        string memory _name,
        bool _isActive,
        bytes16 _funderContractId,
        bool _isChangeConfirmed,
        string memory _paymentDate,
        string memory _modifiedBy,
        string memory _updatedAt
    ) public {
        require(funderIndex[_id] == 0, "FunderRegistry: Funder already exists.");
        funders.push(Funder({
            id: _id,
            name: _name,
            isActive: _isActive,
            funderContractId: _funderContractId,
            isChangeConfirmed: _isChangeConfirmed,
            paymentDate: _paymentDate,
            modifiedBy: _modifiedBy,
            updatedAt: _updatedAt
        }));
        funderIndex[_id] = funders.length; // 1-based index
        emit FunderAdded(_id, _name);
    }

    function updateFunderById(
        bytes16 _id,
        string memory _name,
        bool _isActive,
        bytes16 _funderContractId,
        bool _isChangeConfirmed,
        string memory _paymentDate,
        string memory _modifiedBy,
        string memory _updatedAt
    ) public {
        uint256 idx = funderIndex[_id];
        require(idx > 0, "FunderRegistry: Funder not found.");
        Funder storage f = funders[idx - 1];
        f.name = _name;
        f.isActive = _isActive;
        f.funderContractId = _funderContractId;
        f.isChangeConfirmed = _isChangeConfirmed;
        f.paymentDate = _paymentDate;
        f.modifiedBy = _modifiedBy;
        f.updatedAt = _updatedAt;
    }

    function getAllFunders() public view returns (
        bytes16[] memory ids,
        string[] memory names,
        string[] memory isActives,
        bytes16[] memory funderContractIds,
        bool[] memory isChangeConfirmeds,
        string[] memory paymentDates,
        string[] memory modifiedBys,
        string[] memory updatedAts
    ) {
        uint256 len = funders.length;
        ids = new bytes16[](len);
        names = new string[](len);
        isActives = new string[](len);
        funderContractIds = new bytes16[](len);
        isChangeConfirmeds = new bool[](len);
        paymentDates = new string[](len);
        modifiedBys = new string[](len);
        updatedAts = new string[](len);
        for (uint256 i = 0; i < len; i++) {
            Funder storage f = funders[i];
            ids[i] = f.id;
            names[i] = f.name;
            isActives[i] = f.isActive ? "true" : "false";
            funderContractIds[i] = f.funderContractId;
            isChangeConfirmeds[i] = f.isChangeConfirmed;
            paymentDates[i] = f.paymentDate;
            modifiedBys[i] = f.modifiedBy;
            updatedAts[i] = f.updatedAt;
        }
    }

    function getFunderById(bytes16 _id) public view returns (
        bytes16 id,
        string memory name,
        string memory isActive,
        bytes16 funderContractId,
        bool isChangeConfirmed,
        string memory paymentDate,
        string memory modifiedBy,
        string memory updatedAt
    ) {
        uint256 idx = funderIndex[_id];
        require(idx > 0, "FunderRegistry: Funder not found.");
        Funder storage f = funders[idx - 1];
        id = f.id;
        name = f.name;
        isActive = f.isActive ? "true" : "false";
        funderContractId = f.funderContractId;
        isChangeConfirmed = f.isChangeConfirmed;
        paymentDate = f.paymentDate;
        modifiedBy = f.modifiedBy;
        updatedAt = f.updatedAt;
    }

    function getFunderByName(string memory _name) public view returns (
        bytes16 id,
        string memory name,
        string memory isActive,
        bytes16 funderContractId,
        bool isChangeConfirmed,
        string memory paymentDate,
        string memory modifiedBy,
        string memory updatedAt
    ) {
        for (uint256 i = 0; i < funders.length; i++) {
            if (keccak256(bytes(funders[i].name)) == keccak256(bytes(_name))) {
                Funder storage f = funders[i];
                id = f.id;
                name = f.name;
                isActive = f.isActive ? "true" : "false";
                funderContractId = f.funderContractId;
                isChangeConfirmed = f.isChangeConfirmed;
                paymentDate = f.paymentDate;
                modifiedBy = f.modifiedBy;
                updatedAt = f.updatedAt;
                return (id, name, isActive, funderContractId, isChangeConfirmed, paymentDate, modifiedBy, updatedAt);
            }
        }
    }
}
