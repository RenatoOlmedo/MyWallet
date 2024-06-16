namespace MyWallet.Models.DTO;

public class WalletDTO
{
    public string? WalletId { get; set; }
    public string UserId { get; set; }
    public List<OperationDTO>? Operations { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
    public List<WithdrawDTO>? Withdraws { get; set; }
    public List<DepositDTO>? Deposits { get; set; }
}