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
            .FirstOrDefaultAsync(x => 
                x.User == user 
                && x.Year == year
                && x.Month == month);

        if (wallet is null)
            throw new KeyNotFoundException("Não há dados cadastrados para esse período");

        var expectedDto = new List<SimplifiedOperationDTO>();
        var completedDto = new List<SimplifiedOperationDTO>();
        var onGoingDto = new List<SimplifiedOperationDTO>();

        wallet.Operations
            .Where(x =>
                x.Status == OperationStatusEnum.Ongoing)
            .ToList()
            .ForEach(
                x => expectedDto.Add(new SimplifiedOperationDTO
                {
                    FinancialOperation = x.FinancialOperation,
                    Result = x.ExpectedOutcome
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

        var walletData = await _db.Wallets
            .Include(o => o.Operations)
            .Include(w => w.Withdraw)
            .Include(d => d.Deposit)
            .Where(x => x.User == user)
            .ToListAsync();

        var totalDeposits = 0M;
        var totalWithdraws = 0M;
        var profit = 0M;

        foreach (var userWallet in walletData)
        {
            if(userWallet.Operations is not null)
                profit += userWallet.Operations.Sum(x => x.Result);
            
            if(userWallet.Withdraw is not null)
                totalWithdraws += userWallet.Withdraw.Sum(x => x.Value);
            
            if(userWallet.Deposit is not null)
                totalDeposits += userWallet.Deposit.Sum(x => x.Value);
        }
        
        var walletDTO = new WalletViewDTO
        {
            User = user.UserName,
            Deposit = totalDeposits,
            Withdraw = totalWithdraws,
            Profit = profit,
            AmountInvested = totalDeposits - totalWithdraws,
            CurrentHeritage = totalDeposits - totalWithdraws + profit,
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
            .Include(wallet => wallet.Withdraw)
            .Include(wallet => wallet.Deposit)
            .FirstOrDefaultAsync(x => 
                x.User == user 
                && x.Year == year
                && x.Month == month);
        
        if(wallet is null)
            throw new KeyNotFoundException("Carteira não encontrada!");

        var operations = new List<OperationDTO>();
        var withdraws = new List<WithdrawDTO>();
        var deposits = new List<DepositDTO>();
        
        var walletDto = new WalletDTO
        {
            WalletId = wallet.Id,
            UserId = user.Id,
            Year = wallet.Year,
            Month = wallet.Month
        };
        
        wallet.Operations?.ForEach(x => operations.Add(
            new OperationDTO
            {
                OperationId = x.Id,
                Result = x.Result,
                FinancialOperation = x.FinancialOperation,
                ExpectedOutcome = x.ExpectedOutcome,
                Status = x.Status
            }));
        
        walletDto.Operations = operations;
        
        wallet.Withdraw?.ForEach(x => withdraws.Add(
            new WithdrawDTO
            {
                WithdrawId = x.Id,
                Value = x.Value
            }));
        
        walletDto.Withdraws = withdraws;
        
        wallet.Deposit?.ForEach(x => deposits.Add(
            new DepositDTO()
            {
                DepositId = x.Id,
                Value = x.Value
            }));
        
        walletDto.Deposits = deposits;
        
        return walletDto;
    }

    public async Task UpdateWalletAsync(WalletDTO wallet)
    {
        try
        {
            var user = await _db.Users
                .FindAsync(wallet.UserId);

            if (user is null)
                throw new KeyNotFoundException("Usuário não encontrado!");

            var walletDetails = await _db.Wallets
                .Include(u => u.User)
                .Include(o => o.Operations)
                .Include(w => w.Withdraw)
                .Include(d => d.Deposit)
                .Where(x =>
                    x.Id == wallet.WalletId
                    && x.User == user)
                .FirstAsync();

            if (walletDetails is null)
                throw new KeyNotFoundException("Wallet não encontrada.");

            UpdateWalletDate(wallet, walletDetails);

            var hasOperations = walletDetails.Operations is not null;
            var hasDeposits = walletDetails.Deposit is not null;
            var hasWithdraws = walletDetails.Withdraw is not null;

            if (!hasOperations
                && !hasDeposits
                && !hasWithdraws)
            {
                AddPropsToRawWallet(wallet, walletDetails);

                _db.Wallets.Update(walletDetails);
                await _db.SaveChangesAsync();

                return;
            }

            RemoveExtraOperations(wallet, walletDetails);
            RemoveExtraDeposits(wallet, walletDetails);
            RemoveExtraWithdraws(wallet, walletDetails);

            UpdateWallet(wallet, walletDetails);

            _db.Wallets.Update(walletDetails);
            await _db.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    private static void UpdateWallet(WalletDTO wallet, Wallet walletDetails)
    {
        if(wallet.Operations is not null)
            foreach (var operationDto in wallet.Operations)
            {
                var existingOperation = walletDetails.Operations.FirstOrDefault(o => o.Id == operationDto.OperationId);

                if (existingOperation == null)
                {
                    walletDetails.Operations.Add(new Operation
                    {
                        FinancialOperation = operationDto.FinancialOperation,
                        Result = operationDto.Result,
                        ExpectedOutcome = operationDto.ExpectedOutcome,
                        Status = operationDto.Status,
                    });
                }
                else
                {
                    existingOperation.FinancialOperation = operationDto.FinancialOperation;
                    existingOperation.Result = operationDto.Result;
                    existingOperation.ExpectedOutcome = operationDto.ExpectedOutcome;
                    existingOperation.Status = operationDto.Status;
                }
            }
        
        if(wallet.Deposits is not null)
            foreach (var depositDto in wallet.Deposits)
            {
                var existingDeposit = walletDetails.Deposit?.FirstOrDefault(o => o.Id == depositDto.DepositId);

                if (existingDeposit == null)
                {
                    walletDetails.Deposit.Add(new Deposit
                    {
                        Value = depositDto.Value
                    });
                }
                else
                {
                    existingDeposit.Value = depositDto.Value;
                }
            }
        
        if(wallet.Withdraws is not null)
            foreach (var withdrawDto in wallet.Withdraws)
            {
                var existingWithdraw = walletDetails.Withdraw?.FirstOrDefault(o => o.Id == withdrawDto.WithdrawId);

                if (existingWithdraw == null)
                {
                    walletDetails.Withdraw.Add(new Withdraw
                    {
                        Value = withdrawDto.Value
                    });
                }
                else
                {
                    existingWithdraw.Value = withdrawDto.Value;
                }
            }
    }

    private void RemoveExtraOperations(WalletDTO wallet, Wallet walletDetails)
    {
        if(walletDetails.Operations is null)
            return;
        
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
    
    private void RemoveExtraDeposits(WalletDTO wallet, Wallet walletDetails)
    {
        if(walletDetails.Deposit is null)
            return;
        
        var depositsToRemove = walletDetails.Deposit
            .Where(o =>
                !wallet.Deposits
                    .Any(wo =>
                        wo.DepositId == o.Id))
            .ToList();

        depositsToRemove.ForEach(x =>
            walletDetails.Deposit
                .Remove(x));
        
        _db.Deposits.RemoveRange(depositsToRemove);
    }
    
    private void RemoveExtraWithdraws(WalletDTO wallet, Wallet walletDetails)
    {
        if(walletDetails.Withdraw is null)
            return;
        
        var withdrawsToRemove = walletDetails.Withdraw
            .Where(o =>
                !wallet.Deposits
                    .Any(wo =>
                        wo.DepositId == o.Id))
            .ToList();

        withdrawsToRemove.ForEach(x =>
            walletDetails.Withdraw
                .Remove(x));
        
        _db.Withdraws.RemoveRange(withdrawsToRemove);
    }

    private static void UpdateWalletDate(WalletDTO wallet, Wallet walletDetails)
    {
        walletDetails.Month = wallet.Month;
        walletDetails.Year = wallet.Year;
    }

    private static void AddPropsToRawWallet(WalletDTO wallet, Wallet walletDetails)
    {
        walletDetails.Operations = new List<Operation>();
        walletDetails.Deposit = new List<Deposit>();
        walletDetails.Withdraw = new List<Withdraw>();
        
        wallet.Operations?.ForEach(newOperation => 
                walletDetails.Operations.Add(new Operation
                {
                    FinancialOperation = newOperation.FinancialOperation,
                    Result = newOperation.Result,
                    ExpectedOutcome = newOperation.ExpectedOutcome,
                    Status = newOperation.Status
                })
            );
    
        wallet.Deposits?.ForEach(newDeposit => 
                walletDetails.Deposit.Add(new Deposit
                {
                    Value = newDeposit.Value
                })
            );
    
        wallet.Withdraws?.ForEach(newWithdraw => 
            walletDetails.Withdraw.Add(new Withdraw
            {
                Value = newWithdraw.Value
            })
        );
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

        var deposits = new List<Deposit>();
        var withDraws = new List<Withdraw>();

        if (wallet.Deposits is not null)
            deposits.AddRange(wallet.Deposits
                .Select(d => new Deposit
                {
                    Value = d.Value
                })
            );
        
        if (wallet.Withdraws is not null)
            withDraws.AddRange(wallet.Withdraws
                .Select(w => new Withdraw
                {
                    Value = w.Value
                })
            );

        var operations = new List<Operation>();
        
        var newWallet = new Wallet
        {
            User = user,
            Year = wallet.Year,
            Month = wallet.Month,
            Deposit = deposits,
            Withdraw = withDraws
        };
        
        wallet.Operations?.ForEach(x => operations.Add(
            new Operation
            {
                Result = x.Result,
                FinancialOperation = x.FinancialOperation,
                ExpectedOutcome = x.ExpectedOutcome,
                Status = x.Status
            }));
        
        newWallet.Operations = operations;
        
        await _db.Wallets.AddAsync(newWallet);
        await _db.Withdraws.AddRangeAsync(withDraws);
        await _db.Deposits.AddRangeAsync(deposits);
        await _db.Operations.AddRangeAsync(operations);

        await _db.SaveChangesAsync();
    }

    public async Task DeleteWalletAsync(string walletId)
    {
        var wallet = await _db.Wallets
            .Include(o => o.Operations)
            .Include(d => d.Deposit)
            .Include(w => w.Withdraw)
            .FirstAsync(x => x.Id == walletId);

        _db.Wallets.Remove(wallet);
        
        if (wallet.Operations != null) 
            _db.Operations.RemoveRange(wallet.Operations);
        
        if (wallet.Deposit != null) 
            _db.Deposits.RemoveRange(wallet.Deposit);
        
        if (wallet.Withdraw != null) 
            _db.Withdraws.RemoveRange(wallet.Withdraw);

        await _db.SaveChangesAsync();
    }

    public async Task<List<PeriodResultDTO>> GetPeriodResultByUserAsync(string userId, int year, int month)
    {
        var user = await _db.Users.FindAsync(userId);

        if (user is null)
            throw new KeyNotFoundException("Usuário não encontrado");
        
        var wallets = await _db.Wallets.Where(u =>
            u.User == user)
            .Include(o => o.Operations)
            .OrderByDescending(y => y.Year)
            .ThenByDescending(m => m.Month)
            .Take(12)
            .ToListAsync();

        var periodDto = new List<PeriodResultDTO>();

        foreach (var wallet in wallets)
        {
            var result = 0M;

            if (wallet.Operations is not null)
                result = wallet.Operations
                    .Where(x =>
                        x.Status == OperationStatusEnum.Completed)
                    .Sum(r => r.Result);
            
            periodDto.Add(new PeriodResultDTO
            {
                Month = wallet.Month,
                Year = wallet.Year,
                Result = result
            });
        }
        
        return periodDto;
    }
}