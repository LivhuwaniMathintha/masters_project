// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


/**
 * @title Users
 * @dev Stores user details and allows retrieval for integration with Nethereum and C# DTO mapping
 * @author Nando
 */
contract PaymentsRegistry {
    struct Payment {
        bytes16 id;                // Unique identifier (Guid)
        string accountNumber;
        string studentNumber;
        string branchCode;
        string bankName;
        uint amount;
        string paymentType;
        string status;
        string updatedAt;
        bool isFraud;
        string initiationDate;
        string fulfilmentDate;
        string modifiedBy;
    }

    Payment[] private payments;
    mapping(bytes16 => uint256) private paymentIndex; // For quick lookup

    event PaymentAdded(bytes16 indexed id, string studentNumber);
    event PaymentUpdated(bytes16 indexed id, string status, string fulfilmentDate);

    function addPayment(
        bytes16 _id,
        string memory _accountNumber,
        string memory _studentNumber,
        string memory _branchCode,
        string memory _bankName,
        uint _amount,
        string memory _paymentType,
        string memory _status,
        string memory _updatedAt,
        bool _isFraud,
        string memory _initiationDate,
        string memory _fulfilmentDate,
        string memory _modifiedBy
    ) public {
        require(paymentIndex[_id] == 0, "PaymentsRegistry: Payment already exists.");
        payments.push(Payment({
            id: _id,
            accountNumber: _accountNumber,
            studentNumber: _studentNumber,
            branchCode: _branchCode,
            bankName: _bankName,
            amount: _amount,
            paymentType: _paymentType,
            status: _status,
            updatedAt: _updatedAt,
            isFraud: _isFraud,
            initiationDate: _initiationDate,
            fulfilmentDate: _fulfilmentDate,
            modifiedBy: _modifiedBy
        }));
        paymentIndex[_id] = payments.length; // 1-based index
        emit PaymentAdded(_id, _studentNumber);
    }

    function updatePaymentById(
        bytes16 _id,
        string memory _status,
        string memory _fulfilmentDate,
        string memory _updatedAt,
        string memory _modifiedBy
    ) public {
        uint256 idx = paymentIndex[_id];
        require(idx > 0, "PaymentsRegistry: Payment not found.");
        Payment storage p = payments[idx - 1];
        p.status = _status;
        p.fulfilmentDate = _fulfilmentDate;
        p.updatedAt = _updatedAt;
        p.modifiedBy = _modifiedBy;
        emit PaymentUpdated(_id, _status, _fulfilmentDate);
    }

    function getAllPayments() public view returns (
        bytes16[] memory ids,
        string[] memory accountNumbers,
        string[] memory studentNumbers,
        string[] memory bankNames,
        uint[] memory amounts,
        string[] memory paymentTypes,
        string[] memory statuses,
        string[] memory updatedAts,
        bool[] memory isFrauds,
        string[] memory fulfilmentDates,
        string[] memory modifiedBys
    ) {
        uint256 len = payments.length;
        ids = new bytes16[](len);
        accountNumbers = new string[](len);
        studentNumbers = new string[](len);
        bankNames = new string[](len);
        amounts = new uint[](len);
        paymentTypes = new string[](len);
        statuses = new string[](len);
        updatedAts = new string[](len);
        isFrauds = new bool[](len);
        fulfilmentDates = new string[](len);
        modifiedBys = new string[](len);
        for (uint256 i = 0; i < len; i++) {
            Payment storage p = payments[i];
            ids[i] = p.id;
            accountNumbers[i] = p.accountNumber;
            studentNumbers[i] = p.studentNumber;
            bankNames[i] = p.bankName;
            amounts[i] = p.amount;
            paymentTypes[i] = p.paymentType;
            statuses[i] = p.status;
            updatedAts[i] = p.updatedAt;
            isFrauds[i] = p.isFraud;
            fulfilmentDates[i] = p.fulfilmentDate;
            modifiedBys[i] = p.modifiedBy;
        }
    }

    function getPaymentByStudentNumber(string memory _studentNumber) public view returns (
        bytes16 id,
        string memory accountNumber,
        string memory studentNumber,
        string memory branchCode,
        string memory bankName,
        uint amount,
        string memory paymentType,
        string memory status,
        string memory updatedAt,
        bool isFraud,
        string memory initiationDate,
        string memory fulfilmentDate,
        string memory modifiedBy
    ) {
        for (uint256 i = 0; i < payments.length; i++) {
            if (keccak256(bytes(payments[i].studentNumber)) == keccak256(bytes(_studentNumber))) {
                Payment storage p = payments[i];
                return (
                    p.id,
                    p.accountNumber,
                    p.studentNumber,
                    p.branchCode,
                    p.bankName,
                    p.amount,
                    p.paymentType,
                    p.status,
                    p.updatedAt,
                    p.isFraud,
                    p.initiationDate,
                    p.fulfilmentDate,
                    p.modifiedBy
                );
            }
        }
        revert("PaymentsRegistry: Payment not found by student number.");
    }
}
