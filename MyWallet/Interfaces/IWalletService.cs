using MyWallet.Models.DTO;

namespace MyWallet.Interfaces;

public interface IWalletService
{
    Task<WalletViewDTO> getWalletByUserAndMonthAsync(string userId, DateTime date);
    List<WalletListViewDTO> getWalletListByUser(string userId);
}