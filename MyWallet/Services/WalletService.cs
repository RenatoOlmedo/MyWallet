using Microsoft.EntityFrameworkCore;
using MyWallet.Data;
using MyWallet.Interfaces;
using MyWallet.Models;
using MyWallet.Models.DTO;
using MyWallet.Models.Enums;

namespace MyWallet.Services;

public class WalletService : IWalletService
{
    private readonly ApplicationDbContext _db;

    public WalletService(ApplicationDbContext db)
        => _db = db;
    
    public async Task<WalletViewDTO> GetWalletByUserAndMonthAsync(string userId, int year, int month)
    {
        var user = await _db.Users
            .FindAsync(userId);

        if (user is null)
            throw new KeyNotFoundException("Usuário não encontrado!");
        
        var wallet = await _db.Wallets
            .Include(i => i.Operations)
            .Include(e => e.ExpectedOutcomes)
            .FirstOrDefaultAsync(x => 
                x.User == user 
                && x.Year == year
                && x.Month == month);

        if (wallet is null)
            throw new KeyNotFoundException("Não há dados cadastrados para esse período");

        var expectedDto = new List<SimplifiedOperationDTO>();
        var completedDto = new List<SimplifiedOperationDTO>();
        var onGoingDto = new List<SimplifiedOperationDTO>();

        wallet.ExpectedOutcomes.ForEach(
            x => expectedDto.Add(
                new SimplifiedOperationDTO
                {
                    FinancialOperation = x.FinancialOperation,
                    Result = x.ExpectedResult
                }));
        
        wallet.Operations
            .Where(c => 
                c.Status == OperationStatusEnum.Completed)
            .ToList()
            .ForEach(
            x => completedDto.Add(new SimplifiedOperationDTO
            {
                FinancialOperation = x.FinancialOperation,
                Result = x.Result
            }));
    
        wallet.Operations
            .Where(x =>
                x.Status == OperationStatusEnum.Ongoing)
            .ToList()
            .ForEach(
            x => onGoingDto.Add(new SimplifiedOperationDTO
            {
                FinancialOperation = x.FinancialOperation,
                Result = x.Result
            }));

        var result = 0M;

        if (completedDto.Any())
            result = completedDto.Sum(x => x.Result);
        
        var walletDTO = new WalletViewDTO
        {
            User = user.UserName,
            Deposit = wallet.Deposit,
            AmountInvested = wallet.AmountInvested,
            CurrentHeritage = wallet.CurrentHeritage,
            Withdraw = wallet.Withdraw,
            Profit = wallet.Profit,
            Month = ((MonthsEnum)wallet.Month).ToString(),
            Result = result,
            CompletedOperations = completedDto,
            OnGoingOperations = onGoingDto,
            ExpectedOutcome = expectedDto
        };

        return walletDTO;
    }

    public List<WalletListViewDTO> GetWalletListByUser(string userId)
    {
        var wallets = _db.Wallets
            .Where(x => 
                x.User.Id == userId)
            .OrderByDescending(y => y.Year)
            .ThenBy(m => m.Month);

        var walletsDto = new List<WalletListViewDTO>();

        walletsDto.AddRange(wallets.Select(x => new WalletListViewDTO
            {
                year = x.Year,
                month = x.Month,
                result = Decimal.MinValue,
                walletId = x.Id
            })
        );
        
        return walletsDto;
    }

    public async Task CreateNewWalletAsync(WalletDTO wallet)
    {
        var user = await _db.Users.FindAsync(wallet.UserId);

        if (user is null)
            throw new KeyNotFoundException("Usuário não encontrado");

        var operations = new List<Operation>();
        var expectedOutcome = new List<ExpectedOutcome>();
        
        var newWallet = new Wallet
        {
            User = user,
            Year = wallet.Year,
            Month = wallet.Month,
            AmountInvested = wallet.AmountInvested,
            Deposit = wallet.Deposit,
            Withdraw = wallet.Withdraw,
            Profit = wallet.Profit,
            CurrentHeritage = wallet.CurrentHeritage
        };
        
        wallet.Operations?.ForEach(x => operations.Add(
            new Operation
            {
                Wallet = newWallet,
                Result = x.Result,
                FinancialOperation = x.FinancialOperation,
                Status = x.Status
            }));
        
        wallet.ExpectedOutcomes?.ForEach(e => expectedOutcome.Add(
            new ExpectedOutcome
            {
                Wallet = newWallet,
                ExpectedResult = e.ExpectedResult,
                FinancialOperation = e.FinancialOperation
            }));
        
        newWallet.Operations = operations;
        newWallet.ExpectedOutcomes = expectedOutcome;

        await _db.Wallets.AddAsync(newWallet);
        await _db.Operations.AddRangeAsync(operations);
        await _db.ExpectedOutcomes.AddRangeAsync(expectedOutcome);

        await _db.SaveChangesAsync();
    }

    public async Task<List<PeriodResultDTO>> GetPeriodResultByUser(string userId, int year, int month)
    {
        var results = await _db.PeriodResult.Where(u =>
            u.User.Id == userId
            && u.Year == year
            && u.Month <= month)
            .OrderByDescending(y => y.Year)
            .ThenByDescending(m => m.Month)
            .Take(5)
            .ToListAsync();

        var periodDto = new List<PeriodResultDTO>();
        
        results.ForEach(r => periodDto.Add(new PeriodResultDTO
        {
            Month = r.Month,
            Year = r.Year,
            Result = r.Result
        }));

        return periodDto;
    }

    public async Task CreatePeriodResult(string userId, PeriodResultDTO periodResultDto)
    {
        var user = await _db.Users.FindAsync(userId);
        
        if (user is null)
            throw new KeyNotFoundException("Usuário não encontrado");
        
        var periodResult = new PeriodResult
        {
            Year = periodResultDto.Year,
            Month = periodResultDto.Month,
            Result = periodResultDto.Result,
            User = user
        };

        await _db.PeriodResult.AddAsync(periodResult);
        await _db.SaveChangesAsync();
    }
}