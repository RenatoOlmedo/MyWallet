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
    
    public async Task<WalletViewDTO> GetWalletByUserAndMonthAsync(string userId, DateTime date)
    {
        var user = await _db.Users
            .FindAsync(userId);

        if (user is null)
            throw new KeyNotFoundException("Usuário não encontrado!");
        
        var wallet = await _db.Wallets
            .Include(i => i.Operations)
            .FirstOrDefaultAsync(x => x.User == user && x.ReferenceDate == date);

        if (wallet is null)
            throw new KeyNotFoundException("Não há dados cadastrados para esse período");

        var news = await _db.News
            .Where(x => 
                x.ReferenceDate == date)
            .ToListAsync();

        var newsDto = new List<SimplifiedNews>();
        
        if(news.Any())
            news.ForEach(
                x => newsDto.Add(
                    new SimplifiedNews
                    {
                        Title = x.Title,
                        Body = x.Body
                    }));
        
        var expectedOutcome = await _db.ExpectedOutcomes
            .Where(x => 
                x.Wallet == wallet 
                && x.ReferenceDate == date)
            .ToListAsync();

        var expectedDto = new List<SimplifiedExpectedOutcome>();
        
        if(expectedDto.Any())
            expectedOutcome.ForEach(
                x => expectedDto.Add(
                    new SimplifiedExpectedOutcome
                    {
                        FinancialOperation = x.FinancialOperation,
                        Result = x.ExpectedResult
                    }));

        var operations = wallet.Operations;

        var completedOperations = operations
            .Where(x =>
                x.Status == OperationStatusEnum.Completed)
            .ToList();

        var completedDto = new List<CompletedOperation>();
        
        if(completedOperations.Any())
            completedOperations.ForEach(
                x => completedDto.Add(new CompletedOperation
                {
                    FinancialOperation = x.FinancialOperation,
                    Result = x.Result
                }));
        
        var onGoingOperations = operations
            .Where(x =>
                x.Status == OperationStatusEnum.Completed)
            .ToList();

        var onGoingDto = new List<OnGoingOperation>();
        
        if(onGoingOperations.Any())
            onGoingOperations.ForEach(
                x => onGoingDto.Add(new OnGoingOperation
                {
                    FinancialOperation = x.FinancialOperation,
                    Result = x.Result
                }));

        var result = decimal.MinValue;

        if (completedOperations.Any())
            result = completedDto.Sum(x => x.Result);

        var periodResults = 0;
        
        var walletDTO = new WalletViewDTO
        {
            User = user.UserName,
            Deposit = wallet.Deposit,
            AmountInvested = wallet.AmountInvested,
            CurrentHeritage = wallet.CurrentHeritage,
            Withdraw = wallet.Withdraw,
            Profit = wallet.Profit,
            Month = ((MonthsEnum)wallet.ReferenceDate.Month).ToString(),
            Result = result,
            CompletedOperations = completedDto,
            OnGoingOperations = onGoingDto,
            ExpectedOutcome = expectedDto,
            News = newsDto,
            PeriodResults = null
        };

        return walletDTO;
    }

    public List<WalletListViewDTO> GetWalletListByUser(string userId)
    {
        var wallets = _db.Wallets.Where(x => x.User.Id == userId).OrderByDescending(x => x.ReferenceDate);

        var walletsDto = new List<WalletListViewDTO>();

        walletsDto.AddRange(wallets.Select(x => new WalletListViewDTO
            {
                date = x.ReferenceDate,
                result = Decimal.MinValue,
                walletId = x.Id
            })
        );
        
        return walletsDto;
    }

    public async Task CreateNewWalletAsync(WalletDTO wallet)
    {
        var user = await _db.Users.FindAsync(wallet.UserId);

        var operations = new List<Operation>();
        
        var newWallet = new Wallet
        {
            User = user,
            ReferenceDate = wallet.ReferenceDate,
            AmountInvested = wallet.AmountInvested,
            Deposit = wallet.Deposit,
            Withdraw = wallet.Withdraw,
            Profit = wallet.Profit,
            CurrentHeritage = wallet.CurrentHeritage
        };
        
        wallet.Operations?.ForEach(x => operations.Add(
            new Operation
            {
                Wallet = null,
                Result = x.Result,
                FinancialOperation = x.FinancialOperation,
                Status = x.Status
            }));

        newWallet.Operations = operations;

        await _db.Wallets.AddAsync(newWallet);
        await _db.Operations.AddRangeAsync(operations);

        await _db.SaveChangesAsync();
    }
}