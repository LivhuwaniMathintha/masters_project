// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundingContract {
    struct Funding {
        bytes16 id;
        bytes16 funderId;
        bytes16 studentId;
        bytes16 funderContractConditionId;
        bytes16 dataConfirmedById;
        string signedOn;
        bool isActive;
        uint foodBalance;
        uint tuitionBalance;
        uint laptopBalance;
        uint accommodationBalance;
        string modifiedBy;
        string updatedAt;
    }

    Funding[] private fundings;

    function addFunding(
        bytes16 _id,
        bytes16 _funderId,
        bytes16 _studentId,
        bytes16 _funderContractConditionId,
        bytes16 _dataConfirmedById,
        string memory _signedOn,
        bool _isActive,
        uint _foodBalance,
        uint _tuitionBalance,
        uint _laptopBalance,
        uint _accommodationBalance,
        string memory _modifiedBy,
        string memory _updatedAt
    ) public {
        fundings.push(Funding({
            id: _id,
            funderId: _funderId,
            studentId: _studentId,
            funderContractConditionId: _funderContractConditionId,
            dataConfirmedById: _dataConfirmedById,
            signedOn: _signedOn,
            isActive: _isActive,
            foodBalance: _foodBalance,
            tuitionBalance: _tuitionBalance,
            laptopBalance: _laptopBalance,
            accommodationBalance: _accommodationBalance,
            modifiedBy: _modifiedBy,
            updatedAt: _updatedAt
        }));
    }

    function updateFunding(
        bytes16 _id,
        bool _isActive,
        uint _foodBalance,
        uint _tuitionBalance,
        uint _laptopBalance,
        uint _accommodationBalance,
        string memory _modifiedBy,
        string memory _updatedAt
    ) public {
        for (uint i = 0; i < fundings.length; i++) {
            if (fundings[i].id == _id) {
                fundings[i].isActive = _isActive;
                fundings[i].foodBalance = _foodBalance;
                fundings[i].tuitionBalance = _tuitionBalance;
                fundings[i].laptopBalance = _laptopBalance;
                fundings[i].accommodationBalance = _accommodationBalance;
                fundings[i].modifiedBy = _modifiedBy;
                fundings[i].updatedAt = _updatedAt;
                return;
            }
        }
        revert("Funding not found.");
    }

    function updateFundingDataConfirmedById(
        bytes16 _id,
        bytes16 _dataConfirmedById,
        string memory _modifiedBy,
        string memory _updatedAt
    ) public {
        for (uint i = 0; i < fundings.length; i++) {
            if (fundings[i].id == _id) {
                fundings[i].dataConfirmedById = _dataConfirmedById;
                fundings[i].modifiedBy = _modifiedBy;
                fundings[i].updatedAt = _updatedAt;
                return;
            }
        }
        revert("Funding not found.");
    }

    function getAllFundings() public view returns (
        bytes16[] memory ids,
        bytes16[] memory funderIds,
        bytes16[] memory studentIds,
        bytes16[] memory funderContractConditionIds,
        bytes16[] memory dataConfirmedByIds,
        string[] memory signedOns,
        bool[] memory isActives,
        uint[] memory foodBalances,
        uint[] memory tuitionBalances,
        uint[] memory laptopBalances,
        uint[] memory accommodationBalances,
        string[] memory modifiedBys,
        string[] memory updatedAts
    ) {
        uint count = 0;
        for (uint i = 0; i < fundings.length; i++) {
            if (fundings[i].isActive) {
                count++;
            }
        }
        ids = new bytes16[](count);
        funderIds = new bytes16[](count);
        studentIds = new bytes16[](count);
        funderContractConditionIds = new bytes16[](count);
        dataConfirmedByIds = new bytes16[](count);
        signedOns = new string[](count);
        isActives = new bool[](count);
        foodBalances = new uint[](count);
        tuitionBalances = new uint[](count);
        laptopBalances = new uint[](count);
        accommodationBalances = new uint[](count);
        modifiedBys = new string[](count);
        updatedAts = new string[](count);
        uint idx = 0;
        for (uint i = 0; i < fundings.length; i++) {
            Funding storage f = fundings[i];
            if (f.isActive) {
                ids[idx] = f.id;
                funderIds[idx] = f.funderId;
                studentIds[idx] = f.studentId;
                funderContractConditionIds[idx] = f.funderContractConditionId;
                dataConfirmedByIds[idx] = f.dataConfirmedById;
                signedOns[idx] = f.signedOn;
                isActives[idx] = f.isActive;
                foodBalances[idx] = f.foodBalance;
                tuitionBalances[idx] = f.tuitionBalance;
                laptopBalances[idx] = f.laptopBalance;
                accommodationBalances[idx] = f.accommodationBalance;
                modifiedBys[idx] = f.modifiedBy;
                updatedAts[idx] = f.updatedAt;
                idx++;
            }
        }
    }

    function getFundingByStudentId(bytes16 _studentId) public view returns (
        bytes16 id,
        bytes16 funderId,
        bytes16 studentId,
        bytes16 funderContractConditionId,
        bytes16 dataConfirmedById,
        string memory signedOn,
        bool isActive,
        uint foodBalance,
        uint tuitionBalance,
        uint laptopBalance,
        uint accommodationBalance,
        string memory modifiedBy,
        string memory updatedAt
    ) {
        for (uint i = 0; i < fundings.length; i++) {
            if (fundings[i].studentId == _studentId) {
                Funding storage f = fundings[i];
                return (
                    f.id,
                    f.funderId,
                    f.studentId,
                    f.funderContractConditionId,
                    f.dataConfirmedById,
                    f.signedOn,
                    f.isActive,
                    f.foodBalance,
                    f.tuitionBalance,
                    f.laptopBalance,
                    f.accommodationBalance,
                    f.modifiedBy,
                    f.updatedAt
                );
            }
        }
        revert("Funding not found for student.");
    }

    function getAllInactiveFundings() public view returns (
        bytes16[] memory ids,
        bytes16[] memory funderIds,
        bytes16[] memory studentIds,
        bytes16[] memory funderContractConditionIds,
        bytes16[] memory dataConfirmedByIds,
        string[] memory signedOns,
        bool[] memory isActives,
        uint[] memory foodBalances,
        uint[] memory tuitionBalances,
        uint[] memory laptopBalances,
        uint[] memory accommodationBalances,
        string[] memory modifiedBys,
        string[] memory updatedAts
    ) {
        uint count = 0;
        for (uint i = 0; i < fundings.length; i++) {
            if (!fundings[i].isActive) {
                count++;
            }
        }
        ids = new bytes16[](count);
        funderIds = new bytes16[](count);
        studentIds = new bytes16[](count);
        funderContractConditionIds = new bytes16[](count);
        dataConfirmedByIds = new bytes16[](count);
        signedOns = new string[](count);
        isActives = new bool[](count);
        foodBalances = new uint[](count);
        tuitionBalances = new uint[](count);
        laptopBalances = new uint[](count);
        accommodationBalances = new uint[](count);
        modifiedBys = new string[](count);
        updatedAts = new string[](count);
        uint idx = 0;
        for (uint i = 0; i < fundings.length; i++) {
            Funding storage f = fundings[i];
            if (!f.isActive) {
                ids[idx] = f.id;
                funderIds[idx] = f.funderId;
                studentIds[idx] = f.studentId;
                funderContractConditionIds[idx] = f.funderContractConditionId;
                dataConfirmedByIds[idx] = f.dataConfirmedById;
                signedOns[idx] = f.signedOn;
                isActives[idx] = f.isActive;
                foodBalances[idx] = f.foodBalance;
                tuitionBalances[idx] = f.tuitionBalance;
                laptopBalances[idx] = f.laptopBalance;
                accommodationBalances[idx] = f.accommodationBalance;
                modifiedBys[idx] = f.modifiedBy;
                updatedAts[idx] = f.updatedAt;
                idx++;
            }
        }
    }

    function getInactiveFundingsByStudentId(bytes16 _studentId) public view returns (
        bytes16[] memory ids,
        bytes16[] memory funderIds,
        bytes16[] memory studentIds,
        bytes16[] memory funderContractConditionIds,
        bytes16[] memory dataConfirmedByIds,
        string[] memory signedOns,
        bool[] memory isActives,
        uint[] memory foodBalances,
        uint[] memory tuitionBalances,
        uint[] memory laptopBalances,
        uint[] memory accommodationBalances,
        string[] memory modifiedBys,
        string[] memory updatedAts
    ) {
        uint count = 0;
        for (uint i = 0; i < fundings.length; i++) {
            if (!fundings[i].isActive && fundings[i].studentId == _studentId) {
                count++;
            }
        }
        ids = new bytes16[](count);
        funderIds = new bytes16[](count);
        studentIds = new bytes16[](count);
        funderContractConditionIds = new bytes16[](count);
        dataConfirmedByIds = new bytes16[](count);
        signedOns = new string[](count);
        isActives = new bool[](count);
        foodBalances = new uint[](count);
        tuitionBalances = new uint[](count);
        laptopBalances = new uint[](count);
        accommodationBalances = new uint[](count);
        modifiedBys = new string[](count);
        updatedAts = new string[](count);
        uint idx = 0;
        for (uint i = 0; i < fundings.length; i++) {
            Funding storage f = fundings[i];
            if (!f.isActive && f.studentId == _studentId) {
                ids[idx] = f.id;
                funderIds[idx] = f.funderId;
                studentIds[idx] = f.studentId;
                funderContractConditionIds[idx] = f.funderContractConditionId;
                dataConfirmedByIds[idx] = f.dataConfirmedById;
                signedOns[idx] = f.signedOn;
                isActives[idx] = f.isActive;
                foodBalances[idx] = f.foodBalance;
                tuitionBalances[idx] = f.tuitionBalance;
                laptopBalances[idx] = f.laptopBalance;
                accommodationBalances[idx] = f.accommodationBalance;
                modifiedBys[idx] = f.modifiedBy;
                updatedAts[idx] = f.updatedAt;
                idx++;
            }
        }
    }
}
