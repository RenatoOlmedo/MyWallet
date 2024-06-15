using Microsoft.EntityFrameworkCore;
using MyWallet.Data;
using MyWallet.Interfaces;
using MyWallet.Models;
using MyWallet.Models.DTO;
using MyWallet.Models.Enums;
using static System.Decimal;

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

    public async Task<WalletDTO> GetWalletModalByUserAndMonthAsync(string userId, int year, int month)
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

        var operations = new List<OperationDTO>();
        var expectedOutcome = new List<ExpectedOutcomeDTO>();
        
        var walletDto = new WalletDTO
        {
            WalletId = wallet.Id,
            UserId = user.Id,
            Year = wallet.Year,
            Month = wallet.Month,
            AmountInvested = wallet.AmountInvested,
            Deposit = wallet.Deposit,
            Withdraw = wallet.Withdraw,
            Profit = wallet.Profit,
            CurrentHeritage = wallet.CurrentHeritage
        };
        
        wallet.Operations?.ForEach(x => operations.Add(
            new OperationDTO
            {
                OperationId = x.Id,
                Result = x.Result,
                FinancialOperation = x.FinancialOperation,
                Status = x.Status
            }));
        
        wallet.ExpectedOutcomes?.ForEach(e => expectedOutcome.Add(
            new ExpectedOutcomeDTO
            {
                ExpectedOutcomeId = e.Id,
                ExpectedResult = e.ExpectedResult,
                FinancialOperation = e.FinancialOperation
            }));
        
        walletDto.Operations = operations;
        walletDto.ExpectedOutcomes = expectedOutcome;
        
        return walletDto;
    }

    public async Task UpdateWalletAsync(WalletDTO wallet)
    {
        var walletDetails = await _db.Wallets
            .Include(u => u.User)
            .Include(e => e.ExpectedOutcomes)
            .Include(o => o.Operations)
            .Where(x => 
                x.Id == wallet.WalletId
                && x.User.Id == wallet.UserId)
            .FirstAsync();
        
        if(walletDetails is null)
            throw new KeyNotFoundException("Wallet não encontrada.");

        UpdateWalletBasicProps(wallet, walletDetails);

        var isRawWallet = !walletDetails.Operations.Any()
                          && !walletDetails.ExpectedOutcomes.Any();

        if (isRawWallet)
        {
            AddPropsToRawWallet(wallet, walletDetails);

            _db.Wallets.Update(walletDetails);
            await _db.SaveChangesAsync();
            
            return;
        }

        if (walletDetails.Operations.Any())
        {
            RemoveExtraOperations(wallet, walletDetails);
            UpdateWalletOperations(wallet, walletDetails);
        }

        if (walletDetails.ExpectedOutcomes.Any())
        {
            RemoveExtraOutcomes(wallet, walletDetails);
            UpdateWalletOutcomes(wallet, walletDetails);
        }
        
        _db.Wallets.Update(walletDetails);
        await _db.SaveChangesAsync();
    }

    private static void UpdateWalletOutcomes(WalletDTO wallet, Wallet walletDetails)
    {
        foreach (var expectedOutcomeDto in wallet.ExpectedOutcomes)
        {
            var existingExpectedOutcome =
                walletDetails.ExpectedOutcomes.FirstOrDefault(eo => eo.Id == expectedOutcomeDto.ExpectedOutcomeId);

            if (existingExpectedOutcome == null)
            {
                walletDetails.ExpectedOutcomes.Add(new ExpectedOutcome
                {
                    ExpectedResult = expectedOutcomeDto.ExpectedResult,
                    FinancialOperation = expectedOutcomeDto.FinancialOperation
                });
            }
            else
            {
                existingExpectedOutcome.ExpectedResult = expectedOutcomeDto.ExpectedResult;
                existingExpectedOutcome.FinancialOperation = expectedOutcomeDto.FinancialOperation;
            }
        }
    }

    private static void UpdateWalletOperations(WalletDTO wallet, Wallet walletDetails)
    {
        foreach (var operationDto in wallet.Operations)
        {
            var existingOperation = walletDetails.Operations.FirstOrDefault(o => o.Id == operationDto.OperationId);

            if (existingOperation == null)
            {
                walletDetails.Operations.Add(new Operation
                {
                    FinancialOperation = operationDto.FinancialOperation,
                    Result = operationDto.Result,
                    Status = operationDto.Status,
                });
            }
            else
            {
                existingOperation.FinancialOperation = operationDto.FinancialOperation;
                existingOperation.Result = operationDto.Result;
                existingOperation.Status = operationDto.Status;
            }
        }
    }

    private void RemoveExtraOutcomes(WalletDTO wallet, Wallet walletDetails)
    {
        var outcomesToRemove = walletDetails.ExpectedOutcomes
            .Where(o =>
                !wallet.ExpectedOutcomes
                    .Any(wo =>
                        wo.ExpectedOutcomeId == o.Id))
            .ToList();

        outcomesToRemove.ForEach(x =>
            walletDetails.ExpectedOutcomes
                .Remove(x));
        
        _db.ExpectedOutcomes.RemoveRange(outcomesToRemove);
    }

    private void RemoveExtraOperations(WalletDTO wallet, Wallet walletDetails)
    {
        var operationsToRemove = walletDetails.Operations
            .Where(o =>
                !wallet.Operations
                    .Any(wo =>
                        wo.OperationId == o.Id))
            .ToList();

        operationsToRemove.ForEach(x =>
            walletDetails.Operations
                .Remove(x));
        
        _db.Operations.RemoveRange(operationsToRemove);
    }

    private static void UpdateWalletBasicProps(WalletDTO wallet, Wallet walletDetails)
    {
        walletDetails.Deposit = wallet.Deposit;
        walletDetails.AmountInvested = wallet.AmountInvested;
        walletDetails.CurrentHeritage = wallet.CurrentHeritage;
        walletDetails.Withdraw = wallet.Withdraw;
        walletDetails.Month = wallet.Month;
        walletDetails.Profit = wallet.Profit;
        walletDetails.Year = wallet.Year;
    }

    private static void AddPropsToRawWallet(WalletDTO wallet, Wallet walletDetails)
    {
        walletDetails.Operations = new List<Operation>();
        walletDetails.ExpectedOutcomes = new List<ExpectedOutcome>();

        foreach (var newOperation in wallet.Operations)
        {
            walletDetails.Operations.Add(new Operation
            {
                FinancialOperation = newOperation.FinancialOperation,
                Result = newOperation.Result,
                Status = newOperation.Status
            });
        }

        foreach (var newOutcome in wallet.ExpectedOutcomes)
        {
            walletDetails.ExpectedOutcomes.Add(new ExpectedOutcome
            {
                ExpectedResult = newOutcome.ExpectedResult,
                FinancialOperation = newOutcome.FinancialOperation
            });
        }
    }

    public async Task<WalletListViewDTO> GetWalletListByUserAsync(string userId)
    {
        var user = await _db.Users
            .FindAsync(userId);

        if (user is null)
            throw new KeyNotFoundException("Usuário não encontrado!");
        
        var wallets = _db.Wallets
            .Where(x => 
                x.User == user)
            .Include(o => 
                o.Operations
                    .Where(s => 
                        s.Status == OperationStatusEnum.Completed))
            .OrderByDescending(y => y.Year)
            .ThenBy(m => m.Month);

        var walletsDto = new WalletListViewDTO();

        walletsDto.UserName = user.UserName;
        
        var walletList = new List<WalletListDTO>();

        foreach (var wallet in wallets)
        {
            var result = 0M;

            if (wallet.Operations is not null)
                result = wallet.Operations.Sum(o => o.Result);
            
            walletList.Add(new WalletListDTO
            {
                year = wallet.Year,
                month = wallet.Month,
                result = result,
                walletId = wallet.Id
            });
        }

        walletsDto.WalletList = walletList;
        
        return walletsDto;
    }

    public async Task CreateNewWalletAsync(WalletDTO wallet)
    {
        var user = await _db.Users.FindAsync(wallet.UserId);

        if (user is null)
            throw new KeyNotFoundException("Usuário não encontrado");

        var hasCreatedWallet = await _db.Wallets
            .Where(x => 
                x.User == user 
                && x.Year == wallet.Year 
                && x.Month == wallet.Month)
            .AnyAsync();

        if (hasCreatedWallet)
            throw new Exception("Usuário já possui Carteira para essa data.");

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
                Result = x.Result,
                FinancialOperation = x.FinancialOperation,
                Status = x.Status
            }));
        
        wallet.ExpectedOutcomes?.ForEach(e => expectedOutcome.Add(
            new ExpectedOutcome
            {
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

    public async Task DeleteWalletAsync(string walletId)
    {
        var wallet = await _db.Wallets
            .Include(o => o.Operations)
            .Include(e => e.ExpectedOutcomes)
            .FirstAsync(x => x.Id == walletId);

        _db.Wallets.Remove(wallet);
        
        if (wallet.Operations != null) 
            _db.Operations.RemoveRange(wallet.Operations);
        
        if (wallet.ExpectedOutcomes != null) 
            _db.ExpectedOutcomes.RemoveRange(wallet.ExpectedOutcomes);

        await _db.SaveChangesAsync();
    }

    public async Task<List<PeriodResultDTO>> GetPeriodResultByUserAsync(string userId, int year, int month)
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

    public async Task CreatePeriodResultAsync(string userId, PeriodResultDTO periodResultDto)
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