// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


/**
 * @title Users
 * @dev Stores user details and allows retrieval for integration with Nethereum and C# DTO mapping
 * @author Nando
 */
contract Users {
    struct User {
        bytes16 id;
        bytes16 institutionId;
        bytes16 funderContractId;
        bytes16 bankAccountId;
        string studentNumber;
        string name;
        string email;
        bool isActive;
        bool isChangeConfirmed;
        string modifiedBy;
        string updatedAt;
        string courseName;
        string role;
    }

    User[] private users;
    mapping(bytes16 => uint256) private userIndex; // For quick lookup by id


    function addUser(
        bytes16 _id,
        bytes16 _institutionId,
        bytes16 _funderContractId,
        bytes16 _bankAccountId,
        string memory _studentNumber,
        string memory _name,
        string memory _email,
        bool _isActive,
        bool _isChangeConfirmed,
        string memory _modifiedBy,
        string memory _updatedAt,
        string memory _courseName,
        string memory _role
    ) public {
        require(userIndex[_id] == 0, "Conflict Error (HTTP 409). User already exists. Please check the user ID.");
        users.push(User({
            id: _id,
            institutionId: _institutionId,
            funderContractId: _funderContractId,
            bankAccountId: _bankAccountId,
            studentNumber: _studentNumber,
            name: _name,
            email: _email,
            isActive: _isActive,
            isChangeConfirmed: _isChangeConfirmed,
            modifiedBy: _modifiedBy,
            updatedAt: _updatedAt,
            courseName: _courseName,
            role: _role
        }));
        userIndex[_id] = users.length; // 1-based index
    }

    function updateUserByStudentNumber(
        string memory _studentNumber,
        bytes16 _institutionId,
        bytes16 _funderContractId,
        bytes16 _bankAccountId,
        string memory _name,
        bool _isActive,
        string memory _modifiedBy,
        string memory _updatedAt,
        string memory _courseName,
        string memory _role
    ) public {
        for (uint256 i = 0; i < users.length; i++) {
            if (keccak256(abi.encodePacked(users[i].studentNumber)) == keccak256(abi.encodePacked(_studentNumber))) {
                users[i].institutionId = _institutionId;
                users[i].funderContractId = _funderContractId;
                users[i].bankAccountId = _bankAccountId;
                users[i].name = _name;
                users[i].isActive = _isActive;
                users[i].modifiedBy = _modifiedBy;
                users[i].updatedAt = _updatedAt;
                users[i].courseName = _courseName;
                users[i].role = _role;
                return;
            }
        }
        revert("User not found.");
    }

    function updateUser(
        bytes16 _id,
        bytes16 _institutionId,
        bytes16 _funderContractId,
        bytes16 _bankAccountId,
        string memory _studentNumber,
        string memory _name,
        string memory _email,
        bool _isActive,
        bool _isChangeConfirmed,
        string memory _modifiedBy,
        string memory _updatedAt,
        string memory _courseName,
        string memory _role
    ) public {
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i].id == _id) {
                users[i].institutionId = _institutionId;
                users[i].funderContractId = _funderContractId;
                users[i].bankAccountId = _bankAccountId;
                users[i].studentNumber = _studentNumber;
                users[i].name = _name;
                users[i].email = _email;
                users[i].isActive = _isActive;
                users[i].isChangeConfirmed = _isChangeConfirmed;
                users[i].modifiedBy = _modifiedBy;
                users[i].updatedAt = _updatedAt;
                users[i].courseName = _courseName;
                users[i].role = _role;
                return;
            }
        }
        revert("User not found.");
    }

    function getAllUsers() public view returns (
        bytes16[] memory ids,
        bytes16[] memory institutionIds,
        bytes16[] memory funderContractIds,
        bytes16[] memory bankAccountIds,
        string[] memory studentNumbers,
        string[] memory names,
        string[] memory emails,
        bool[] memory isActives,
        bool[] memory isChangeConfirmeds,
        string[] memory modifiedBys,
        string[] memory updatedAts,
        string[] memory courseNames,
        string[] memory roles
    ) {
        uint256 len = users.length;
        ids = new bytes16[](len);
        institutionIds = new bytes16[](len);
        funderContractIds = new bytes16[](len);
        bankAccountIds = new bytes16[](len);
        studentNumbers = new string[](len);
        names = new string[](len);
        emails = new string[](len);
        isActives = new bool[](len);
        isChangeConfirmeds = new bool[](len);
        modifiedBys = new string[](len);
        updatedAts = new string[](len);
        courseNames = new string[](len);
        roles = new string[](len);

        for (uint256 i = 0; i < len; i++) {
            User storage u = users[i];
            ids[i] = u.id;
            institutionIds[i] = u.institutionId;
            funderContractIds[i] = u.funderContractId;
            bankAccountIds[i] = u.bankAccountId;
            studentNumbers[i] = u.studentNumber;
            names[i] = u.name;
            emails[i] = u.email;
            isActives[i] = u.isActive;
            isChangeConfirmeds[i] = u.isChangeConfirmed;
            modifiedBys[i] = u.modifiedBy;
            updatedAts[i] = u.updatedAt;
            courseNames[i] = u.courseName;
            roles[i] = u.role;
        }
    }

    function getUserByStudentNumber(string memory _studentNumber) public view returns (
        bytes16 id,
        bytes16 institutionId,
        bytes16 funderContractId,
        bytes16 bankAccountId,
        string memory studentNumber,
        string memory name,
        string memory email,
        bool isActive,
        bool isChangeConfirmed,
        string memory modifiedBy,
        string memory updatedAt,
        string memory courseName,
        string memory role
    ) {
        for (uint256 i = 0; i < users.length; i++) {
            if (keccak256(abi.encodePacked(users[i].studentNumber)) == keccak256(abi.encodePacked(_studentNumber))) {
                User storage u = users[i];
                return (
                    u.id,
                    u.institutionId,
                    u.funderContractId,
                    u.bankAccountId,
                    u.studentNumber,
                    u.name,
                    u.email,
                    u.isActive,
                    u.isChangeConfirmed,
                    u.modifiedBy,
                    u.updatedAt,
                    u.courseName,
                    u.role
                );
            }
        }
        revert("User not found.");
    }

    function getUserByName(string memory _name) public view returns (
        bytes16 id,
        bytes16 institutionId,
        bytes16 funderContractId,
        bytes16 bankAccountId,
        string memory studentNumber,
        string memory name,
        string memory email,
        bool isActive,
        bool isChangeConfirmed,
        string memory modifiedBy,
        string memory updatedAt,
        string memory courseName,
        string memory role
    ) {
        for (uint256 i = 0; i < users.length; i++) {
            if (keccak256(abi.encodePacked(users[i].name)) == keccak256(abi.encodePacked(_name))) {
                User storage u = users[i];
                return (
                    u.id,
                    u.institutionId,
                    u.funderContractId,
                    u.bankAccountId,
                    u.studentNumber,
                    u.name,
                    u.email,
                    u.isActive,
                    u.isChangeConfirmed,
                    u.modifiedBy,
                    u.updatedAt,
                    u.courseName,
                    u.role
                );
            }
        }
        revert("User not found.");
    }
}