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

namespace BlockiFinAid.Services.SmartContracts.BankAccount
{
    public class BankAccountOutputDto
    {
        public Guid Id { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankName { get; set; }
        public string BankBranchCode { get; set; }
        public bool IsConfirmed { get; set; }
        public uint StudentNumber { get; set; }
        public Guid DataConfirmedById { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
    }

    public class BankAccountInputDto
    {
        public Guid Id { get; set; }
        public string BankAccountNumber { get; set; }
        public string BankName { get; set; }
        public string BankBranchCode { get; set; }
        public bool IsConfirmed { get; set; }
        public uint StudentNumber { get; set; }
        public Guid DataConfirmedById { get; set; }
        public string CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public string UpdatedAt { get; set; }
    }

    public class BankAccountUpdateDto
    {
        public string BankAccountNumber { get; set; }
        public string BankName { get; set; }
        public string BankBranchCode { get; set; }
        public bool IsConfirmed { get; set; }
        public uint StudentNumber { get; set; }
        public Guid DataConfirmedById { get; set; }
        public string ModifiedBy { get; set; }
        public string UpdatedAt { get; set; }
    }

    [Function("getAllBankAccounts", "tuple[]")]
    public class GetAllBankAccountsFunction : FunctionMessage { }

    [Function("getBankAccountById", "tuple")]
    public class GetBankAccountByIdFunction : FunctionMessage
    {
        [Parameter("bytes16", "_id", 1)]
        public byte[] Id { get; set; }
    }

    [Function("getBankAccountByNumber", "tuple")]
    public class GetBankAccountByNumberFunction : FunctionMessage
    {
        [Parameter("string", "_bankAccountNumber", 1)]
        public string BankAccountNumber { get; set; }
    }

    [FunctionOutput]
    public class GetAllBankAccountsOutputDTO : IFunctionOutputDTO
    {
        [Parameter("bytes16[]", "ids", 1)]
        public List<byte[]> Ids { get; set; }
        [Parameter("string[]", "bankAccountNumbers", 2)]
        public List<string> BankAccountNumbers { get; set; }
        [Parameter("string[]", "bankNames", 3)]
        public List<string> BankNames { get; set; }
        [Parameter("string[]", "bankBranchCodes", 4)]
        public List<string> BankBranchCodes { get; set; }
        [Parameter("bool[]", "isConfirmeds", 5)]
        public List<bool> IsConfirmeds { get; set; }
        [Parameter("uint32[]", "studentNumbers", 6)]
        public List<uint> StudentNumbers { get; set; }
        [Parameter("bytes16[]", "dataConfirmedByIds", 7)]
        public List<byte[]> DataConfirmedByIds { get; set; }
        [Parameter("string[]", "createdAts", 8)]
        public List<string> CreatedAts { get; set; }
        [Parameter("string[]", "updatedAts", 9)]
        public List<string> UpdatedAts { get; set; }
        [Parameter("string[]", "createdBys", 10)]
        public List<string> CreatedBys { get; set; }
        [Parameter("string[]", "modifiedBys", 11)]
        public List<string> ModifiedBys { get; set; }
    }

    [FunctionOutput]
    public class GetBankAccountByIdOutputDto : IFunctionOutputDTO
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

    [FunctionOutput]
    public class GetBankAccountByNumberOutputDto : IFunctionOutputDTO
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

    [Function("addBankAccount")]
    public class AddBankAccountFunction : FunctionMessage
    {
        [Parameter("bytes16", "_id", 1)]
        public byte[] Id { get; set; }
        [Parameter("string", "_bankAccountNumber", 2)]
        public string BankAccountNumber { get; set; }
        [Parameter("string", "_bankName", 3)]
        public string BankName { get; set; }
        [Parameter("string", "_bankBranchCode", 4)]
        public string BankBranchCode { get; set; }
        [Parameter("bool", "_isConfirmed", 5)]
        public bool IsConfirmed { get; set; }
        [Parameter("uint32", "_studentNumber", 6)]
        public uint StudentNumber { get; set; }
        [Parameter("bytes16", "_dataConfirmedById", 7)]
        public byte[] DataConfirmedById { get; set; }
        [Parameter("string", "_createdBy", 8)]
        public string CreatedBy { get; set; }
        [Parameter("string", "_createdAt", 9)]
        public string CreatedAt { get; set; }
    }

    [Function("updateBankAccountByNumber")]
    public class UpdateBankAccountByNumberFunction : FunctionMessage
    {
        [Parameter("string", "_bankAccountNumber", 1)]
        public string BankAccountNumber { get; set; }
        [Parameter("string", "_bankName", 2)]
        public string BankName { get; set; }
        [Parameter("string", "_bankBranchCode", 3)]
        public string BankBranchCode { get; set; }
        [Parameter("bool", "_isConfirmed", 4)]
        public bool IsConfirmed { get; set; }
        [Parameter("uint32", "_studentNumber", 5)]
        public uint StudentNumber { get; set; }
        [Parameter("bytes16", "_dataConfirmedById", 6)]
        public byte[] DataConfirmedById { get; set; }
        [Parameter("string", "_modifiedBy", 7)]
        public string ModifiedBy { get; set; }
        [Parameter("string", "_updatedAt", 8)]
        public string UpdatedAt { get; set; }
    }

    public class BankAccountContract
    {
        private readonly SmartContractAddressSettings _addressSettings;
        private readonly Web3 _web3;
        private readonly EthereumNodeSettings _nodeSettings;

        public BankAccountContract(IOptions<EthereumNodeSettings> nodeSettings, IOptions<SmartContractAddressSettings> addressSettings)
        {
            _nodeSettings = nodeSettings.Value;
            _addressSettings = addressSettings.Value;
            var account = new Account(_nodeSettings.PrivateKey);
            _web3 = new Web3(account, _nodeSettings.RpcUrl);
        }

        public async Task<string> AddBankAccountAsync(BankAccountInputDto dto)
        {
            var function = new AddBankAccountFunction
            {
                Id = dto.Id.ToByteArray(),
                BankAccountNumber = dto.BankAccountNumber,
                BankName = dto.BankName,
                BankBranchCode = dto.BankBranchCode,
                IsConfirmed = dto.IsConfirmed,
                StudentNumber = dto.StudentNumber,
                DataConfirmedById = dto.DataConfirmedById.ToByteArray(),
                CreatedBy = dto.CreatedBy,
                CreatedAt = dto.CreatedAt
            };
            var contract = _web3.Eth.GetContractTransactionHandler<AddBankAccountFunction>();
            var receipt = await contract.SendRequestAndWaitForReceiptAsync(_addressSettings.BankAccountAddress, function);
            var txHash = receipt?.TransactionHash;
            if (txHash == null)
            {
                return receipt?.HasErrors()?.ToString();
            }
            return txHash.ToString();
        }

    [FunctionOutput]
    public class BankAccountStructOutputDto : IFunctionOutputDTO
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

    public async Task<List<BankAccountOutputDto>> GetAllBankAccountsAsync()
    {
        var function = new GetAllBankAccountsFunction();
        var contract = _web3.Eth.GetContractHandler(_addressSettings.BankAccountAddress);
        var result = await contract.QueryDeserializingToObjectAsync<GetAllBankAccountsFunction, List<BankAccountStructOutputDto>>(function);
        var accounts = new List<BankAccountOutputDto>();
        foreach (var item in result)
        {
            accounts.Add(new BankAccountOutputDto
            {
                Id = new Guid(item.Id),
                BankAccountNumber = item.BankAccountNumber,
                BankName = item.BankName,
                BankBranchCode = item.BankBranchCode,
                IsConfirmed = item.IsConfirmed,
                StudentNumber = item.StudentNumber,
                DataConfirmedById = new Guid(item.DataConfirmedById),
                CreatedAt = item.CreatedAt,
                UpdatedAt = item.UpdatedAt,
                CreatedBy = item.CreatedBy,
                ModifiedBy = item.ModifiedBy
            });
        }
        return accounts;
    }

        public async Task<BankAccountOutputDto> GetBankAccountByIdAsync(Guid id)
        {
            var function = new GetBankAccountByIdFunction
            {
                Id = id.ToByteArray()
            };
            var contract = _web3.Eth.GetContractHandler(_addressSettings.BankAccountAddress);
            var result = await contract.QueryDeserializingToObjectAsync<GetBankAccountByIdFunction, GetBankAccountByIdOutputDto>(function);

            return new BankAccountOutputDto
            {
                Id = new Guid(result.Id),
                BankAccountNumber = result.BankAccountNumber,
                BankName = result.BankName,
                BankBranchCode = result.BankBranchCode,
                IsConfirmed = result.IsConfirmed,
                StudentNumber = result.StudentNumber,
                DataConfirmedById = new Guid(result.DataConfirmedById),
                CreatedAt = result.CreatedAt,
                UpdatedAt = result.UpdatedAt,
                CreatedBy = result.CreatedBy,
                ModifiedBy = result.ModifiedBy
            };
        }

        public async Task<BankAccountOutputDto> GetBankAccountByNumberAsync(string bankAccountNumber)
        {
            var function = new GetBankAccountByNumberFunction
            {
                BankAccountNumber = bankAccountNumber
            };
            var contract = _web3.Eth.GetContractHandler(_addressSettings.BankAccountAddress);
            var result = await contract.QueryDeserializingToObjectAsync<GetBankAccountByNumberFunction, GetBankAccountByNumberOutputDto>(function);

            return new BankAccountOutputDto
            {
                Id = new Guid(result.Id),
                BankAccountNumber = result.BankAccountNumber,
                BankName = result.BankName,
                BankBranchCode = result.BankBranchCode,
                IsConfirmed = result.IsConfirmed,
                StudentNumber = result.StudentNumber,
                DataConfirmedById = new Guid(result.DataConfirmedById),
                CreatedAt = result.CreatedAt,
                UpdatedAt = result.UpdatedAt,
                CreatedBy = result.CreatedBy,
                ModifiedBy = result.ModifiedBy
            };
        }

        public async Task<string> UpdateBankAccountByNumberAsync(BankAccountUpdateDto dto)
        {
            var function = new UpdateBankAccountByNumberFunction
            {
                BankAccountNumber = dto.BankAccountNumber,
                BankName = dto.BankName,
                BankBranchCode = dto.BankBranchCode,
                IsConfirmed = dto.IsConfirmed,
                StudentNumber = dto.StudentNumber,
                DataConfirmedById = dto.DataConfirmedById.ToByteArray(),
                ModifiedBy = dto.ModifiedBy,
                UpdatedAt = dto.UpdatedAt
            };
            var contract = _web3.Eth.GetContractTransactionHandler<UpdateBankAccountByNumberFunction>();
            var receipt = await contract.SendRequestAndWaitForReceiptAsync(_addressSettings.BankAccountAddress, function);
            return receipt.TransactionHash;
        }
    }
}
