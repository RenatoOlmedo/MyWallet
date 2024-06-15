using MyWallet.Models;
using MyWallet.Models.DTO;

namespace MyWallet.Interfaces;

public interface IWalletService
{
    Task<WalletViewDTO> GetWalletByUserAndMonthAsync(string userId, int year, int month);
    Task<WalletDTO> GetWalletModalByUserAndMonthAsync(string userId, int year, int month);
    Task UpdateWalletAsync(WalletDTO wallet);
    Task<WalletListViewDTO> GetWalletListByUserAsync(string userId);
    Task CreateNewWalletAsync(WalletDTO wallet);
    Task DeleteWalletAsync(string walletId);
    Task<List<PeriodResultDTO>> GetPeriodResultByUserAsync(string userId, int year, int month);
    Task CreatePeriodResultAsync(string userId, PeriodResultDTO periodResultDto);
}