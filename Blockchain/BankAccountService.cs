using System;
using System.Numerics;
using System.Threading.Tasks;
using Nethereum.Web3;
using Nethereum.Contracts;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;
using System.Collections.Generic;

namespace FinancialAid.SmartContract
{
    // DTO for BankAccount
    public class BankAccountDto
    {
        public Guid Id { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankName { get; set; }
        public string BankBranchCode { get; set; }
        public bool IsConfirmed { get; set; }
        public int StudentNumber { get; set; }
        public Guid DataConfirmedById { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsChangeConfirmed { get; set; }
    }

    // Function Messages
    [Function("addBankAccount")]
    public class AddBankAccountFunction : FunctionMessage
    {
        [Parameter("bytes16", "id", 1)]
        public byte[] Id { get; set; }

        [Parameter("string", "bankAccountNumber", 2)]
        public string BankAccountNumber { get; set; }

        [Parameter("string", "bankName", 3)]
        public string BankName { get; set; }

        [Parameter("string", "bankBranchCode", 4)]
        public string BankBranchCode { get; set; }

        [Parameter("bool", "isConfirmed", 5)]
        public bool IsConfirmed { get; set; }

        [Parameter("uint32", "studentNumber", 6)]
        public uint StudentNumber { get; set; }

        [Parameter("bytes16", "dataConfirmedById", 7)]
        public byte[] DataConfirmedById { get; set; }

        [Parameter("string", "createdBy", 8)]
        public string CreatedBy { get; set; }

        [Parameter("string", "createdAt", 9)]
        public string CreatedAt { get; set; }
    }

    [Function("updateBankAccountByNumber")]
    public class UpdateBankAccountByNumberFunction : FunctionMessage
    {
        [Parameter("string", "bankAccountNumber", 1)]
        public string BankAccountNumber { get; set; }

        [Parameter("string", "bankName", 2)]
        public string BankName { get; set; }

        [Parameter("string", "bankBranchCode", 3)]
        public string BankBranchCode { get; set; }

        [Parameter("bool", "isConfirmed", 4)]
        public bool IsConfirmed { get; set; }

        [Parameter("uint32", "studentNumber", 5)]
        public uint StudentNumber { get; set; }

        [Parameter("bytes16", "dataConfirmedById", 6)]
        public byte[] DataConfirmedById { get; set; }

        [Parameter("string", "modifiedBy", 7)]
        public string ModifiedBy { get; set; }

        [Parameter("string", "updatedAt", 8)]
        public string UpdatedAt { get; set; }
    }

    // Output DTO for queries
    [FunctionOutput]
    public class BankAccountOutputDto : IFunctionOutputDTO
    {
        [Parameter("bytes16", "id", 1)]
        public byte[] Id { get; set; }

        [Parameter("string", "bankAccountNumber", 2)]
        public string BankAccountNumber { get; set; }

        [Parameter("string", "bankName", 3)]
        public string BankName { get; set; }

        [Parameter("string", "bankBranchCode", 4)]
        public string BankBranchCode { get; set; }

        [Parameter("bool", "isConfirmed", 5)]
        public bool IsConfirmed { get; set; }

        [Parameter("uint32", "studentNumber", 6)]
        public uint StudentNumber { get; set; }

        [Parameter("bytes16", "dataConfirmedById", 7)]
        public byte[] DataConfirmedById { get; set; }

        [Parameter("string", "createdAt", 8)]
        public string CreatedAt { get; set; }

        [Parameter("string", "updatedAt", 9)]
        public string UpdatedAt { get; set; }

        [Parameter("string", "createdBy", 10)]
        public string CreatedBy { get; set; }

        [Parameter("string", "modifiedBy", 11)]
        public string ModifiedBy { get; set; }
    }

    public class BankAccountService
    {
        private readonly Web3 _web3;
        private readonly string _contractAddress;

        public BankAccountService(Web3 web3, string contractAddress)
        {
            _web3 = web3;
            _contractAddress = contractAddress;
        }

        public async Task<string> AddBankAccountAsync(AddBankAccountFunction function)
        {
            var handler = _web3.Eth.GetContractTransactionHandler<AddBankAccountFunction>();
            return await handler.SendRequestAsync(_contractAddress, function);
        }

        public async Task<string> UpdateBankAccountByNumberAsync(UpdateBankAccountByNumberFunction function)
        {
            var handler = _web3.Eth.GetContractTransactionHandler<UpdateBankAccountByNumberFunction>();
            return await handler.SendRequestAsync(_contractAddress, function);
        }

        public async Task<BankAccountOutputDto> GetBankAccountByIdAsync(byte[] id)
        {
            var function = new FunctionMessage { }; // Placeholder for call
            var handler = _web3.Eth.GetContractQueryHandler<FunctionMessage>();
            var result = await handler.QueryDeserializingToObjectAsync<BankAccountOutputDto>(
                new FunctionMessage { }, _contractAddress, new object[] { id });
            return result;
        }

        public async Task<BankAccountOutputDto> GetBankAccountByNumberAsync(string bankAccountNumber)
        {
            var function = new FunctionMessage { }; // Placeholder for call
            var handler = _web3.Eth.GetContractQueryHandler<FunctionMessage>();
            var result = await handler.QueryDeserializingToObjectAsync<BankAccountOutputDto>(
                new FunctionMessage { }, _contractAddress, new object[] { bankAccountNumber });
            return result;
        }

        public async Task<List<BankAccountOutputDto>> GetAllBankAccountsAsync()
        {
            var function = new FunctionMessage { }; // Placeholder for call
            var handler = _web3.Eth.GetContractQueryHandler<FunctionMessage>();
            var result = await handler.QueryDeserializingToObjectAsync<List<BankAccountOutputDto>>(
                new FunctionMessage { }, _contractAddress);
            return result;
        }
    }
}
