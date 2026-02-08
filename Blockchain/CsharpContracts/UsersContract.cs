using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BlockiFinAid.Data.Configs;
using BlockiFinAid.Helpers;
using Microsoft.Extensions.Options;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;
using Nethereum.Web3;
using Nethereum.Web3.Accounts;
using Newtonsoft.Json;

namespace BlockiFinAid.Services.SmartContracts.Users
{
    public class UserOutputDto
    {
        public string Id { get; set; } // Changed from Guid to string
        public string BankAccountId { get; set; } // Changed from Guid to string
        public string FunderContractId { get; set; } // Changed from Guid to string
        public string InstitutionId { get; set; } // Changed from Guid to string
        public string Name { get; set; }
        public string StudentNumber { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public bool IsChangeConfirmed { get; set; }
        public string ModifiedBy { get; set; }
        public string UpdatedAt { get; set; }
        public string CourseName { get; set; }
        public string Role { get; set; }
    }

    public class UserInputDto
    {
        public string Id { get; set; }
        public string BankAccountId { get; set; }
        public string FunderContractId { get; set; }
        public string InstitutionId { get; set; }
        public string Name { get; set; }
        public string StudentNumber { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public bool IsChangeConfirmed { get; set; }
        public string ModifiedBy { get; set; }
        public string UpdatedAt { get; set; }
        public string CourseName { get; set; }
        public string Role { get; set; }
    }

    public class UserUpdateDto
    {
        public string Id { get; set; } // Changed from Guid to string
        public string BankAccountId { get; set; } // Changed from Guid to string
        public string FunderContractId { get; set; } // Changed from Guid to string
        public string InstitutionId { get; set; } // Changed from Guid to string
        public string Name { get; set; }
        public string StudentNumber { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public bool IsChangeConfirmed { get; set; }
        public string ModifiedBy { get; set; }
        public string UpdatedAt { get; set; }
        public string CourseName { get; set; }
        public string Role { get; set; }
    }

    [Function("getAllUsers", "tuple[]")]
    public class GetAllUsersFunction : FunctionMessage { }

    [Function("addUser")]
    public class AddUserFunction : FunctionMessage
    {
        [Parameter("string", "_id", 1)] // Changed from bytes16 to string
        public string Id { get; set; }
        [Parameter("string", "_bankAccountId", 2)]
        public string BankAccountId { get; set; }
        [Parameter("string", "_funderContractId", 3)]
        public string FunderContractId { get; set; }
        [Parameter("string", "_institutionId", 4)]
        public string InstitutionId { get; set; }
        [Parameter("string", "_name", 5)]
        public string Name { get; set; }
        [Parameter("string", "_studentNumber", 6)]
        public string StudentNumber { get; set; }
        [Parameter("string", "_email", 7)]
        public string Email { get; set; }
        [Parameter("bool", "_isActive", 8)]
        public bool IsActive { get; set; }
        [Parameter("bool", "_isChangeConfirmed", 9)]
        public bool IsChangeConfirmed { get; set; }
        [Parameter("string", "_modifiedBy", 10)]
        public string ModifiedBy { get; set; }
        [Parameter("string", "_updatedAt", 11)]
        public string UpdatedAt { get; set; }
        [Parameter("string", "_courseName", 12)]
        public string CourseName { get; set; }
        [Parameter("string", "_role", 13)]
        public string Role { get; set; }
    }

    [Function("updateUserByStudentNumber")]
    public class UpdateUserByStudentNumberFunction : FunctionMessage
    {
        [Parameter("string", "_studentNumber", 1)]
        public string StudentNumber { get; set; }
        [Parameter("string", "_name", 2)]
        public string Name { get; set; }
        [Parameter("bool", "_isActive", 3)]
        public bool IsActive { get; set; }
        [Parameter("string", "_funderContractId", 4)] // Changed from bytes16 to string
        public string FunderContractId { get; set; }
        [Parameter("string", "_bankAccountId", 5)] // Changed from bytes16 to string
        public string BankAccountId { get; set; }
        [Parameter("string", "_modifiedBy", 6)]
        public string ModifiedBy { get; set; }
        [Parameter("string", "_updatedAt", 7)]
        public string UpdatedAt { get; set; }
        [Parameter("string", "_courseName", 8)]
        public string CourseName { get; set; }
        [Parameter("string", "_role", 9)]
        public string Role { get; set; }
    }

    [FunctionOutput]
    public class GetAllUsersOutputDTO : IFunctionOutputDTO
    {
        [Parameter("string[]", "ids", 1)] // Changed from bytes16[] to string[]
        public List<string> Ids { get; set; }
        [Parameter("string[]", "bankAccountIds", 2)]
        public List<string> BankAccountIds { get; set; }
        [Parameter("string[]", "funderContractIds", 3)]
        public List<string> FunderContractIds { get; set; }
        [Parameter("string[]", "institutionIds", 4)]
        public List<string> InstitutionIds { get; set; }
        [Parameter("string[]", "names", 5)]
        public List<string> Names { get; set; }
        [Parameter("string[]", "studentNumbers", 6)]
        public List<string> StudentNumbers { get; set; }
        [Parameter("string[]", "emails", 7)]
        public List<string> Emails { get; set; }
        [Parameter("bool[]", "isActives", 8)]
        public List<bool> IsActives { get; set; }
        [Parameter("bool[]", "isChangeConfirmeds", 9)]
        public List<bool> IsChangeConfirmeds { get; set; }
        [Parameter("string[]", "modifiedBys", 10)]
        public List<string> ModifiedBys { get; set; }
        [Parameter("string[]", "updatedAts", 11)]
        public List<string> UpdatedAts { get; set; }
        [Parameter("string[]", "courseNames", 12)]
        public List<string> CourseNames { get; set; }
        [Parameter("string[]", "roles", 13)]
        public List<string> Roles { get; set; }
    }

    public class UsersContract
    {
        private readonly SmartContractAddressSettings _addressSettings;
        private readonly Web3 _web3;
        private readonly EthereumNodeSettings _nodeSettings;

        public UsersContract(IOptions<EthereumNodeSettings> nodeSettings, IOptions<SmartContractAddressSettings> addressSettings)
        {
            _nodeSettings = nodeSettings.Value;
            _addressSettings = addressSettings.Value;
            var account = new Account(_nodeSettings.PrivateKey);
            _web3 = new Web3(account, _nodeSettings.RpcUrl);
        }

        public async Task<string> AddUserAsync(UserInputDto dto)
        {
            var function = new AddUserFunction
            {
                Id = dto.Id,
                BankAccountId = dto.BankAccountId,
                FunderContractId = dto.FunderContractId,
                InstitutionId = dto.InstitutionId,
                Name = dto.Name,
                StudentNumber = dto.StudentNumber,
                Email = dto.Email,
                IsActive = dto.IsActive,
                IsChangeConfirmed = dto.IsChangeConfirmed,
                ModifiedBy = dto.ModifiedBy,
                UpdatedAt = dto.UpdatedAt,
                CourseName = dto.CourseName,
                Role = dto.Role,
                FromAddress = _nodeSettings.ContractAddress
            };
            var contract = _web3.Eth.GetContractTransactionHandler<AddUserFunction>();
            var receipt = await contract.SendRequestAndWaitForReceiptAsync(_addressSettings.UsersAddress, function);
            var txHash = receipt?.TransactionHash;
            if (txHash == null)
            {
                return receipt?.HasErrors()?.ToString();
            }
            return txHash.ToString();
        }

        public async Task<List<UserOutputDto>> GetAllUsersAsync()
        {
            var function = new GetAllUsersFunction();
            var contract = _web3.Eth.GetContractHandler(_addressSettings.UsersAddress);
            var result = await contract.QueryDeserializingToObjectAsync<GetAllUsersFunction, GetAllUsersOutputDTO>(function);
            var users = new List<UserOutputDto>();
            for (int i = 0; i < result.Ids.Count; i++)
            {
                users.Add(new UserOutputDto
                {
                    Id = result.Ids[i],
                    BankAccountId = result.BankAccountIds[i],
                    FunderContractId = result.FunderContractIds[i],
                    InstitutionId = result.InstitutionIds[i],
                    Name = result.Names[i],
                    StudentNumber = result.StudentNumbers[i],
                    Email = result.Emails[i],
                    IsActive = result.IsActives[i],
                    IsChangeConfirmed = result.IsChangeConfirmeds[i],
                    ModifiedBy = result.ModifiedBys[i],
                    UpdatedAt = result.UpdatedAts[i],
                    CourseName = result.CourseNames[i],
                    Role = result.Roles[i]
                });
            }
            return users;
        }

        public async Task<string> UpdateUserByStudentNumberAsync(UserUpdateDto dto)
        {
            var function = new UpdateUserByStudentNumberFunction
            {
                StudentNumber = dto.StudentNumber,
                Name = dto.Name,
                IsActive = dto.IsActive,
                FunderContractId = dto.FunderContractId,
                BankAccountId = dto.BankAccountId,
                ModifiedBy = dto.ModifiedBy,
                UpdatedAt = dto.UpdatedAt,
                CourseName = dto.CourseName,
                Role = dto.Role,
                FromAddress = _nodeSettings.ContractAddress
            };
            var contract = _web3.Eth.GetContractTransactionHandler<UpdateUserByStudentNumberFunction>();
            var receipt = await contract.SendRequestAndWaitForReceiptAsync(_addressSettings.UsersAddress, function);
            return receipt.TransactionHash;
        }
    }
}
