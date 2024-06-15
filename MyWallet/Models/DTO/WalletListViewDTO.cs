namespace MyWallet.Models.DTO;

public class WalletListViewDTO
{
    public string UserName { get; set; }
    public List<WalletListDTO> WalletList{ get; set; }
}

public class WalletListDTO
{
    public int year { get; set; }
    public int month { get; set; }
    public decimal result { get; set; }
    public string walletId { get; set; }
}