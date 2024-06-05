namespace MyWallet.Models.DTO;

public class WalletDTO
{
    public string UserId { get; set; }
    public List<OperationDTO>? Operations { get; set; }
    public DateTime ReferenceDate { get; set; }
    public decimal AmountInvested { get; set; }
    public decimal Deposit { get; set; }
    public decimal Withdraw { get; set; }
    public decimal Profit { get; set; }
    public decimal CurrentHeritage { get; set; }
}