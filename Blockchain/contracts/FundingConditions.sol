// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundingConditions {
    struct Condition {
        bytes16 id;
        bool isFullCoverage;
        string startDate;
        string endDate;
        uint totalAmount;
        uint foodAmount;
        uint tuitionAmount;
        uint laptopAmount;
        uint accommodationAmount;
        bool accommodationDirectPay;
        bytes16 dataConfirmedById;
        string modifiedBy;
        string updatedAt;
        bool isActive;
        uint averageMark;
    }

    Condition[] private conditions;

    function addCondition(
        bytes16 _id,
        bool _isFullCoverage,
        string memory _startDate,
        string memory _endDate,
        uint _totalAmount,
        uint _foodAmount,
        uint _tuitionAmount,
        uint _laptopAmount,
        uint _accommodationAmount,
        bool _accommodationDirectPay,
        bytes16 _dataConfirmedById,
        string memory _modifiedBy,
        string memory _updatedAt,
        bool _isActive,
        uint _averageMark
    ) public {
        for (uint i = 0; i < conditions.length; i++) {
            if (conditions[i].id == _id) {
                revert("Condition with this id already exists.");
            }
        }
        conditions.push(Condition({
            id: _id,
            isFullCoverage: _isFullCoverage,
            startDate: _startDate,
            endDate: _endDate,
            totalAmount: _totalAmount,
            foodAmount: _foodAmount,
            tuitionAmount: _tuitionAmount,
            laptopAmount: _laptopAmount,
            accommodationAmount: _accommodationAmount,
            accommodationDirectPay: _accommodationDirectPay,
            dataConfirmedById: _dataConfirmedById,
            modifiedBy: _modifiedBy,
            updatedAt: _updatedAt,
            isActive: _isActive,
            averageMark: _averageMark
        }));
    }

    function updateCondition(
        bytes16 _id,
        bool _isActive,
        uint _averageMark,
        string memory _modifiedBy,
        string memory _updatedAt
    ) public {
        for (uint i = 0; i < conditions.length; i++) {
            if (conditions[i].id == _id) {
                conditions[i].isActive = _isActive;
                conditions[i].modifiedBy = _modifiedBy;
                conditions[i].updatedAt = _updatedAt;
                conditions[i].averageMark = _averageMark;
                return;
            }
        }
        revert("Condition not found.");
    }

    function updateDataConfirmedById(
        bytes16 _id,
        bytes16 _dataConfirmedById,
        string memory _modifiedBy,
        string memory _updatedAt
    ) public {
        for (uint i = 0; i < conditions.length; i++) {
            if (conditions[i].id == _id) {
                conditions[i].dataConfirmedById = _dataConfirmedById;
                conditions[i].modifiedBy = _modifiedBy;
                conditions[i].updatedAt = _updatedAt;
                return;
            }
        }
        revert("Condition not found.");
    }

    function getAllConditions() public view returns (
        bytes16[] memory ids,
        bool[] memory isFullCoverages,
        string[] memory startDates,
        string[] memory endDates,
        uint[] memory totalAmounts,
        uint[] memory foodAmounts,
        uint[] memory tuitionAmounts,
        uint[] memory laptopAmounts,
        uint[] memory accommodationAmounts,
        bool[] memory accommodationDirectPays,
        bytes16[] memory dataConfirmedByIds,
        string[] memory modifiedBys,
        string[] memory updatedAts,
        bool[] memory isActives,
        uint[] memory averageMarks
    ) {
        uint count = 0;
        for (uint i = 0; i < conditions.length; i++) {
            if (conditions[i].isActive) {
                count++;
            }
        }
        ids = new bytes16[](count);
        isFullCoverages = new bool[](count);
        startDates = new string[](count);
        endDates = new string[](count);
        totalAmounts = new uint[](count);
        foodAmounts = new uint[](count);
        tuitionAmounts = new uint[](count);
        laptopAmounts = new uint[](count);
        accommodationAmounts = new uint[](count);
        accommodationDirectPays = new bool[](count);
        dataConfirmedByIds = new bytes16[](count);
        modifiedBys = new string[](count);
        updatedAts = new string[](count);
        isActives = new bool[](count);
        averageMarks = new uint[](count);
        uint idx = 0;
        for (uint i = 0; i < conditions.length; i++) {
            Condition storage c = conditions[i];
            if (c.isActive) {
                ids[idx] = c.id;
                isFullCoverages[idx] = c.isFullCoverage;
                startDates[idx] = c.startDate;
                endDates[idx] = c.endDate;
                totalAmounts[idx] = c.totalAmount;
                foodAmounts[idx] = c.foodAmount;
                tuitionAmounts[idx] = c.tuitionAmount;
                laptopAmounts[idx] = c.laptopAmount;
                accommodationAmounts[idx] = c.accommodationAmount;
                accommodationDirectPays[idx] = c.accommodationDirectPay;
                dataConfirmedByIds[idx] = c.dataConfirmedById;
                modifiedBys[idx] = c.modifiedBy;
                updatedAts[idx] = c.updatedAt;
                isActives[idx] = c.isActive;
                averageMarks[idx] = c.averageMark;
                idx++;
            }
        }
    }

    function getConditionById(bytes16 _id) public view returns (
        bytes16 id,
        bool isFullCoverage,
        string memory startDate,
        string memory endDate,
        uint totalAmount,
        uint foodAmount,
        uint tuitionAmount,
        uint laptopAmount,
        uint accommodationAmount,
        bool accommodationDirectPay,
        bytes16 dataConfirmedById,
        string memory modifiedBy,
        string memory updatedAt,
        bool isActive,
        uint averageMark
    ) {
        for (uint i = 0; i < conditions.length; i++) {
            if (conditions[i].id == _id) {
                Condition storage c = conditions[i];
                return (
                    c.id,
                    c.isFullCoverage,
                    c.startDate,
                    c.endDate,
                    c.totalAmount,
                    c.foodAmount,
                    c.tuitionAmount,
                    c.laptopAmount,
                    c.accommodationAmount,
                    c.accommodationDirectPay,
                    c.dataConfirmedById,
                    c.modifiedBy,
                    c.updatedAt,
                    c.isActive,
                    c.averageMark
                );
            }
        }
        revert("Condition not found.");
    }

    function getAllInactiveConditions() public view returns (
        bytes16[] memory ids,
        bool[] memory isFullCoverages,
        string[] memory startDates,
        string[] memory endDates,
        uint[] memory totalAmounts,
        uint[] memory foodAmounts,
        uint[] memory tuitionAmounts,
        uint[] memory laptopAmounts,
        uint[] memory accommodationAmounts,
        bool[] memory accommodationDirectPays,
        bytes16[] memory dataConfirmedByIds,
        string[] memory modifiedBys,
        string[] memory updatedAts,
        bool[] memory isActives,
        uint[] memory averageMarks
    ) {
        uint count = 0;
        for (uint i = 0; i < conditions.length; i++) {
            if (!conditions[i].isActive) {
                count++;
            }
        }
        ids = new bytes16[](count);
        isFullCoverages = new bool[](count);
        startDates = new string[](count);
        endDates = new string[](count);
        totalAmounts = new uint[](count);
        foodAmounts = new uint[](count);
        tuitionAmounts = new uint[](count);
        laptopAmounts = new uint[](count);
        accommodationAmounts = new uint[](count);
        accommodationDirectPays = new bool[](count);
        dataConfirmedByIds = new bytes16[](count);
        modifiedBys = new string[](count);
        updatedAts = new string[](count);
        isActives = new bool[](count);
        averageMarks = new uint[](count);
        uint idx = 0;
        for (uint i = 0; i < conditions.length; i++) {
            Condition storage c = conditions[i];
            if (!c.isActive) {
                ids[idx] = c.id;
                isFullCoverages[idx] = c.isFullCoverage;
                startDates[idx] = c.startDate;
                endDates[idx] = c.endDate;
                totalAmounts[idx] = c.totalAmount;
                foodAmounts[idx] = c.foodAmount;
                tuitionAmounts[idx] = c.tuitionAmount;
                laptopAmounts[idx] = c.laptopAmount;
                accommodationAmounts[idx] = c.accommodationAmount;
                accommodationDirectPays[idx] = c.accommodationDirectPay;
                dataConfirmedByIds[idx] = c.dataConfirmedById;
                modifiedBys[idx] = c.modifiedBy;
                updatedAts[idx] = c.updatedAt;
                isActives[idx] = c.isActive;
                averageMarks[idx] = c.averageMark;
                idx++;
            }
        }
    }
}
