using BlockiFinAid.Data.Models;
using BlockiFinAid.Helpers;
using BlockiFinAid.Services.Repository;
using BlockiFinAid.Services.SmartContracts.BankAccount;
using BlockiFinAid.Services.SmartContracts.Funder;
using BlockiFinAid.Services.SmartContracts.Funding;
using BlockiFinAid.Services.SmartContracts.Payment;
using BlockiFinAid.Services.SmartContracts.User;
using System.Globalization;

namespace BlockiFinAid.Services.Messaging;

public class PaymentEvent
{
    public string FromAccountNumber { get; set; } = string.Empty;
    public string FromBankName { get; set; } = string.Empty;
    public string FromBankBranchCode { get; set; } = string.Empty;
    public string ToAccountNumber { get; set; } = string.Empty;
    public string ToBankName { get; set; } = string.Empty;
    public string ToBankBranchCode { get; set; } = string.Empty;
    public bool IsPaid { get; set; }
    public DateTime InitiatedDateTime { get; set; } = DateTime.UtcNow;
    public DateTime FulfillmentDate { get; set; }
    public string Status { get; set; } = "Initiated";
    public bool IsFraud { get; set; }
    public string PaymentType { get; set; } = "Food";
    public decimal Amount { get; set; }
}

public class PaymentInitiator : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<MongoDbBackgroundPublisherService> _logger;

    public PaymentInitiator(
        IServiceScopeFactory scopeFactory,
        ILogger<MongoDbBackgroundPublisherService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Delay(TimeSpan.FromMinutes(2), stoppingToken);

        using var scope = _scopeFactory.CreateScope();

        var funderContract = scope.ServiceProvider.GetRequiredService<FunderContract>();
        var bankingAccountContract = scope.ServiceProvider.GetRequiredService<BankAccountContract>();
        var usersContract = scope.ServiceProvider.GetRequiredService<UserContract>();
        var contractConditions = scope.ServiceProvider.GetRequiredService<FundingConditionsContract>();
        var funding = scope.ServiceProvider.GetRequiredService<FundingContract>();
        var paymentModel = scope.ServiceProvider.GetRequiredService<IBaseRepository<PaymentModel>>();
        var paymentCheckerRepo = scope.ServiceProvider.GetRequiredService<IBaseRepository<PaymentCheckerModel>>();

        var today = DateTime.UtcNow.Date;
        var targetDate = today.AddDays(2);

        var allFunders = await funderContract.GetAllFundersAsync();

        foreach (var funder in allFunders)
        {
            // Parse configured schedule date (day-of-month matters)
            var configuredDate = DateTime.Parse(
                funder.PaymentDate,
                CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal
            );

            // Build effective payment date for THIS month
            var daysInMonth = DateTime.DaysInMonth(today.Year, today.Month);
            var paymentDay = Math.Min(configuredDate.Day, daysInMonth);

            var effectivePaymentDate = new DateTime(
                today.Year,
                today.Month,
                paymentDay
            );

            // Skip if not exactly 2 days from today
            if (effectivePaymentDate != targetDate)
            {
                _logger.LogInformation(
                    "[Payment Initiator] - Payment date {PaymentDate} for {Funder} is not {TargetDate}",
                    effectivePaymentDate, funder.Name, targetDate);
                continue;
            }

            // Prevent duplicate monthly processing
            var paymentChecks = await paymentCheckerRepo.GetAllAsync();
            var alreadyProcessed = paymentChecks.Any(x =>
                x.FunderId == funder.Id &&
                x.LastPaidDate.Date == effectivePaymentDate);

            if (alreadyProcessed)
            {
                _logger.LogInformation(
                    "[Payment Initiator] - Payment already processed for {Funder} this month",
                    funder.Name);
                continue;
            }

            _logger.LogInformation(
                "[Payment Initiator] - Processing payments for {Funder} on {Date}",
                funder.Name, effectivePaymentDate);

            var funderUser = await usersContract.GetUserByNameAsync(funder.Name);
            if (funderUser == null) continue;

            var funderBank = await bankingAccountContract
                .GetByStudentNumberAsync(funderUser.StudentNumber);
            if (funderBank == null) continue;

            var allStudents = await usersContract.GetAllUsersAsync();
            var funderStudents = allStudents
                .FindAll(x => x.FunderContractId == funder.Id);

            var allPayments = await paymentModel.GetAllAsync();

            foreach (var student in funderStudents)
            {
                var studentBank =
                    await bankingAccountContract.GetByStudentNumberAsync(student.StudentNumber);
                if (studentBank == null) continue;

                var fundingContract =
                    await funding.GetFundingByStudentIdAsync(student.Id);
                if (fundingContract == null) continue;

                var conditions =
                    await contractConditions.GetConditionByIdAsync(
                        fundingContract.FunderContractConditionId.ToString());
                if (conditions == null) continue;

                string groupId;
                do { groupId = UAMHelper.GeneratePaymentGroupNumber(); }
                while (allPayments.Any(x => x.TransactionGroupId == groupId));

                string trxId;
                do { trxId = UAMHelper.GeneratePaymentGroupNumber(); }
                while (allPayments.Any(x => x.TransactionId == trxId));

                var basePayment = new PaymentModel
                {
                    Id = Guid.NewGuid(),
                    AccountNumber = studentBank.BankAccountNumber,
                    BankName = studentBank.BankName,
                    BranchCode = studentBank.BankBranchCode,
                    FulfilmentDate = effectivePaymentDate,
                    InitiationDate = DateTime.UtcNow,
                    InstitutionServiceId = funderUser.Id,
                    IsFraud = false,
                    ModifiedBy = "api-admin",
                    UpdatedAt = DateTime.UtcNow,
                    Status = "Initiated",
                    Institution = "University of Johannesburg",
                    StudentId = student.Id,
                    StudentNumber = student.StudentNumber,
                    Funder = funder.Name,
                    TransactionGroupId = groupId,
                    TransactionId = trxId
                };

                if (fundingContract.FoodBalance > 0)
                {
                    var amount = conditions.FoodAmount / 10;
                    if (fundingContract.FoodBalance >= amount)
                    {
                        basePayment.PaymentType = "Food";
                        basePayment.Amount = amount;

                        await paymentModel.CreateAsync(basePayment, "sys-api");

                        await funding.UpdateFundingAsync(new FundingUpdateDto
                        {
                            Id = fundingContract.Id.ToString(),
                            IsActive = true,
                            FoodBalance = fundingContract.FoodBalance - amount,
                            ModifiedBy = "api-admin"
                        });
                    }
                }
            }

            await paymentCheckerRepo.CreateAsync(new PaymentCheckerModel
            {
                Id = Guid.NewGuid(),
                FunderId = funder.Id,
                LastPaidDate = effectivePaymentDate
            }, "sys-admin");
        }
    }
}
