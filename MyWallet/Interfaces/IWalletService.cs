using MyWallet.Models.DTO;

namespace MyWallet.Interfaces;

public interface IWalletService
{
    Task<WalletViewDTO> GetWalletByUserAndMonthAsync(string userId, int year, int month);
    List<WalletListViewDTO> GetWalletListByUser(string userId);
    Task CreateNewWalletAsync(WalletDTO wallet);
    Task<List<PeriodResultDTO>> GetPeriodResultByUser(string userId, int year, int month);
    Task CreatePeriodResult(string userId, PeriodResultDTO periodResultDto);
}