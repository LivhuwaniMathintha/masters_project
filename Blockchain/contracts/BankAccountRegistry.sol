// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title BankAccountRegistry
 * @dev Stores bank account details and allows retrieval by bank account number for integration with Nethereum and C# DTO mapping.
 */
contract BankAccountRegistry {
    struct BankAccount {
        bytes16 id; // Guid
        string bankAccountNumber; // string
        string bankName;
        string bankBranchCode;
        bool isConfirmed;
        string studentNumber; // int
        bytes16 dataConfirmedById; // Guid (student_id)
        string updatedAt; // Last update timestamp
    }

    BankAccount[] private bankAccounts;
    mapping(bytes16 => uint256) private bankAccountIndex; // For quick lookup by id
    mapping(string => uint256) private bankAccountNumberIndex; // For lookup by bankAccountNumber

    event BankAccountAdded(bytes16 indexed id, string bankAccountNumber, string studentNumber, string createdAt, string createdBy);
    event BankAccountUpdated(string bankAccountNumber, string updatedAt, string modifiedBy);

    function addBankAccount(
        bytes16 _id,
        string memory _bankAccountNumber,
        string memory _bankName,
        string memory _bankBranchCode,
        bool _isConfirmed,
        string memory _studentNumber,
        bytes16 _dataConfirmedById,
        string memory _updatedAt
    ) public {
        require(bankAccountIndex[_id] == 0, "BankAccountRegistry: Account already exists (id)." );
        require(bankAccountNumberIndex[_bankAccountNumber] == 0, "BankAccountRegistry: Account already exists (number)." );
        bankAccounts.push(BankAccount({
            id: _id,
            bankAccountNumber: _bankAccountNumber,
            bankName: _bankName,
            bankBranchCode: _bankBranchCode,
            isConfirmed: _isConfirmed,
            studentNumber: _studentNumber,
            dataConfirmedById: _dataConfirmedById,
            updatedAt: _updatedAt
        }));
        bankAccountIndex[_id] = bankAccounts.length;
        bankAccountNumberIndex[_bankAccountNumber] = bankAccounts.length;
        emit BankAccountAdded(_id, _bankAccountNumber, _studentNumber, "", "");
    }

    function getByBankAccountNumber(string memory _bankAccountNumber) public view returns (
        bytes16 id,
        string memory bankAccountNumber,
        string memory bankName,
        string memory bankBranchCode,
        bool isConfirmed,
        string memory studentNumber,
        bytes16 dataConfirmedById,
        string memory updatedAt
    ) {
        uint256 idx = bankAccountNumberIndex[_bankAccountNumber];
        require(idx > 0, "BankAccountRegistry: Account not found.");
        BankAccount storage b = bankAccounts[idx - 1];
        id = b.id;
        bankAccountNumber = b.bankAccountNumber;
        bankName = b.bankName;
        bankBranchCode = b.bankBranchCode;
        isConfirmed = b.isConfirmed;
        studentNumber = b.studentNumber;
        dataConfirmedById = b.dataConfirmedById;
        updatedAt = b.updatedAt;
    }

    function updateBankAccountByNumber(
        string memory _bankAccountNumber,
        string memory _bankName,
        string memory _bankBranchCode,
        bool _isConfirmed,
        string memory _studentNumber,
        bytes16 _dataConfirmedById,
        string memory _updatedAt
    ) public {
        uint256 idx = bankAccountNumberIndex[_bankAccountNumber];
        require(idx > 0, "BankAccountRegistry: Account not found.");
        BankAccount storage b = bankAccounts[idx - 1];
        b.bankName = _bankName;
        b.bankBranchCode = _bankBranchCode;
        b.isConfirmed = _isConfirmed;
        b.studentNumber = _studentNumber;
        b.dataConfirmedById = _dataConfirmedById;
        b.updatedAt = _updatedAt;
        emit BankAccountUpdated(_bankAccountNumber, _updatedAt, "");
    }

    function studentDataChangeConfirmation(string memory _bankAccountNumber, bool _isConfirmed, string memory _updatedAt, bytes16 _dataConfirmedById) public {
        uint256 idx = bankAccountNumberIndex[_bankAccountNumber];
        require(idx > 0, "BankAccountRegistry: Account not found.");
        BankAccount storage b = bankAccounts[idx - 1];
        b.isConfirmed = _isConfirmed;
        b.updatedAt = _updatedAt;
        b.dataConfirmedById = _dataConfirmedById;
        emit BankAccountUpdated(_bankAccountNumber, _updatedAt, "");
    }

    function getByStudentNumber(string memory _studentNumber) public view returns (
        bytes16 id,
        string memory bankAccountNumber,
        string memory bankName,
        string memory bankBranchCode,
        bool isConfirmed,
        string memory studentNumber,
        bytes16 dataConfirmedById,
        string memory updatedAt
    ) {
        for (uint256 i = 0; i < bankAccounts.length; i++) {
            if (keccak256(abi.encodePacked(bankAccounts[i].studentNumber)) == keccak256(abi.encodePacked(_studentNumber))) {
                BankAccount storage b = bankAccounts[i];
                return (
                    b.id,
                    b.bankAccountNumber,
                    b.bankName,
                    b.bankBranchCode,
                    b.isConfirmed,
                    b.studentNumber,
                    b.dataConfirmedById,
                    b.updatedAt
                );
            }
        }
        revert("BankAccountRegistry: Account not found.");
    }

    function getAll() public view returns (
        bytes16[] memory ids,
        string[] memory bankAccountNumbers,
        string[] memory bankNames,
        string[] memory bankBranchCodes,
        bool[] memory isConfirmeds,
        string[] memory studentNumbers,
        bytes16[] memory dataConfirmedByIds,
        string[] memory updatedAts
    ) {
        uint256 len = bankAccounts.length;
        ids = new bytes16[](len);
        bankAccountNumbers = new string[](len);
        bankNames = new string[](len);
        bankBranchCodes = new string[](len);
        isConfirmeds = new bool[](len);
        studentNumbers = new string[](len);
        dataConfirmedByIds = new bytes16[](len);
        updatedAts = new string[](len);
        for (uint256 i = 0; i < len; i++) {
            BankAccount storage b = bankAccounts[i];
            ids[i] = b.id;
            bankAccountNumbers[i] = b.bankAccountNumber;
            bankNames[i] = b.bankName;
            bankBranchCodes[i] = b.bankBranchCode;
            isConfirmeds[i] = b.isConfirmed;
            studentNumbers[i] = b.studentNumber;
            dataConfirmedByIds[i] = b.dataConfirmedById;
            updatedAts[i] = b.updatedAt;
        }
    }
}
