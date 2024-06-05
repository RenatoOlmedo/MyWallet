using MyWallet.Models.DTO;

namespace MyWallet.Interfaces;

public interface IWalletService
{
    Task<WalletViewDTO> GetWalletByUserAndMonthAsync(string userId, DateTime date);
    List<WalletListViewDTO> GetWalletListByUser(string userId);
    Task CreateNewWalletAsync(WalletDTO wallet);
}